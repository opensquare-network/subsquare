import {
  getBeneficiaryJunction,
  getParaChainId,
} from "../teleportFromHydration";
import {
  DOT_SYMBOL,
  getFeeAssetLocation,
  getTransferAsset,
  getTransferAssetLocation,
} from "../transferAssets";

// 2^128 - 1 (u128::MAX) — the "withdraw everything" amount in fee-quoting XCMs.
const MAX_U128 = 2n ** 128n - 1n;

// The destination fee is padded by 20% before being surfaced.
const DESTINATION_FEE_MARGIN_PERCENT = 20n;

// dry_run_call(origin, call, result_xcms_version): per polkadot-sdk PR #7438
// the third argument is the XCM version the dry-run result should use
// (4 = V4), not a bitmask of flags.
const DRY_RUN_RESULT_XCM_VERSION = 4;

// Asset Hub derives a sibling parachain's sovereign account as the ASCII bytes
// "sibl" followed by the u32 little-endian paraId (the `Sibling`
// AccountIdConversion used by Asset Hub).
const SIBLING_ACCOUNT_PREFIX = "sibl";
const SIBLING_ACCOUNT_PREFIX_LENGTH = 4;

const EMPTY_TOPIC =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

// Asset Hub source fee: the extrinsic weight fee (charged in DOT) plus the XCM
// delivery fee, which Asset Hub charges on top (usesDeliveryFee). The weight
// fee and the transfer tx are resolved by the caller, who dispatches on the
// source chain.
export async function estimateAssetHubSourceFee({
  sourceApi,
  sourceChain,
  destinationChain,
  symbol,
  transferToAddress,
  tx,
  partialFee,
}) {
  const deliveryFee = await getAssetHubDeliveryFee({
    sourceApi,
    sourceChain,
    destinationChain,
    symbol,
    transferToAddress,
    tx,
  });
  return {
    amount: partialFee + deliveryFee,
    symbol: DOT_SYMBOL,
    decimals: getTransferAsset(DOT_SYMBOL).decimals,
  };
}

// Asset Hub's XCM delivery fee, quoted via the reserve-transfer XCM the
// destination executes. Falls back to queryDeliveryFees when the dry-run API is
// unavailable or the simulation fails.
async function getAssetHubDeliveryFee({
  sourceApi,
  sourceChain,
  destinationChain,
  symbol,
  transferToAddress,
  tx,
}) {
  const dryRunFee = await estimateDeliveryFeeByDryRun({
    sourceApi,
    destinationChain,
    tx,
  });
  if (dryRunFee != null) {
    return dryRunFee;
  }
  return getDeliveryFeeByQuery({
    sourceApi,
    sourceChain,
    destinationChain,
    symbol,
    transferToAddress,
  });
}

// Asset Hub destination fee, quoted via XcmPaymentApi (queryXcmWeight ->
// queryWeightToAssetFee) in the transferred asset, padded by 20% before being
// surfaced.
export async function getAssetHubDestinationFee({
  destinationApi,
  destinationChain,
  symbol,
  transferToAddress,
}) {
  const rawFee = await queryAssetHubDestinationFee({
    destinationApi,
    destinationChain,
    symbol,
    transferToAddress,
  });
  return {
    amount: padFeeByPercentage(rawFee, DESTINATION_FEE_MARGIN_PERCENT),
    symbol,
    decimals: getTransferAsset(symbol).decimals,
  };
}

// Estimates the XCM delivery fee by dry-running the actual transfer signed by
// the destination parachain's sovereign account and summing the
// `polkadotXcm.FeesPaid` events. Returns null when the dry-run API is
// unavailable or the simulation fails, letting the caller fall back to
// queryDeliveryFees.
async function estimateDeliveryFeeByDryRun({
  sourceApi,
  destinationChain,
  tx,
}) {
  if (typeof sourceApi.call?.dryRunApi?.dryRunCall !== "function") {
    return null;
  }

  const sovereign = getSiblingSovereignAccount(
    sourceApi,
    getParaChainId(destinationChain),
  );

  try {
    const result = await sourceApi.call.dryRunApi.dryRunCall(
      { system: { Signed: sovereign } },
      tx.method ?? tx,
      DRY_RUN_RESULT_XCM_VERSION,
    );
    if (!result.isOk || result.asOk.executionResult?.toJSON?.()?.err) {
      return null;
    }
    return getFeesPaidTotal(result.asOk.emittedEvents || []);
  } catch (e) {
    console.error("Asset Hub delivery fee dry-run failed:", e);
    return null;
  }
}

function getSiblingSovereignAccount(api, paraId) {
  const key = new Uint8Array(32);
  key.set(new TextEncoder().encode(SIBLING_ACCOUNT_PREFIX));
  new DataView(key.buffer).setUint32(
    SIBLING_ACCOUNT_PREFIX_LENGTH,
    paraId,
    true,
  );
  return api.createType("AccountId32", key).toString();
}

async function getDeliveryFeeByQuery({
  sourceApi,
  sourceChain,
  destinationChain,
  symbol,
  transferToAddress,
}) {
  // queryDeliveryFees is exposed by Asset Hub's metadata, but some API
  // instances (e.g. ones built from a stale cached metadata) may not decorate
  // it — degrade gracefully to the weight fee alone instead of crashing.
  if (typeof sourceApi.call?.xcmPaymentApi?.queryDeliveryFees !== "function") {
    console.warn(
      "xcmPaymentApi.queryDeliveryFees is not available, showing the weight fee only",
    );
    return 0n;
  }

  try {
    const result = await sourceApi.call.xcmPaymentApi.queryDeliveryFees(
      {
        V4: {
          parents: 1,
          interior: {
            X1: [{ Parachain: getParaChainId(destinationChain) }],
          },
        },
      },
      buildDestinationFeeXcm({
        api: sourceApi,
        destinationChain,
        symbol,
        transferToAddress,
      }),
      getFeeAssetLocation({ chain: sourceChain, symbol: DOT_SYMBOL }),
    );
    return getFirstFungibleAmount(result);
  } catch (e) {
    console.error("Asset Hub delivery fee query failed:", e);
    return 0n;
  }
}

// The Asset Hub destination fee, quoted via XcmPaymentApi
// (queryXcmWeight -> queryWeightToAssetFee) in the transferred asset.
async function queryAssetHubDestinationFee({
  destinationApi,
  destinationChain,
  symbol,
  transferToAddress,
}) {
  const xcmPaymentApi = destinationApi.call?.xcmPaymentApi;
  if (
    typeof xcmPaymentApi?.queryXcmWeight !== "function" ||
    typeof xcmPaymentApi?.queryWeightToAssetFee !== "function"
  ) {
    throw new Error("XcmPaymentApi is not available on Asset Hub");
  }

  const weightResult = await xcmPaymentApi.queryXcmWeight(
    buildDestinationFeeXcm({
      api: destinationApi,
      destinationChain,
      symbol,
      transferToAddress,
    }),
  );
  if (!weightResult.isOk) {
    throw new Error("XcmPaymentApi queryXcmWeight failed on Asset Hub");
  }

  const feeResult = await xcmPaymentApi.queryWeightToAssetFee(
    weightResult.asOk,
    getFeeAssetLocation({ chain: destinationChain, symbol }),
  );
  if (!feeResult.isOk) {
    throw new Error("XcmPaymentApi queryWeightToAssetFee failed on Asset Hub");
  }

  return BigInt(feeResult.asOk.toString());
}

// Builds the XCM the destination chain executes for the transfer, as seen from
// the destination (WithdrawAsset, ClearOrigin, BuyExecution, DepositAsset,
// SetTopic), used to quote the weight -> asset fee.
function buildDestinationFeeXcm({
  api,
  destinationChain,
  symbol,
  transferToAddress,
}) {
  const assetLocation = getTransferAssetLocation({
    sourceChain: destinationChain,
    symbol,
  });

  return {
    V4: [
      withdrawAllAssets(assetLocation),
      { ClearOrigin: null },
      buyExecution(assetLocation),
      depositToBeneficiary({
        api,
        transferToAddress,
      }),
      { SetTopic: EMPTY_TOPIC },
    ],
  };
}

// The `api` is only used to encode the beneficiary AccountId32 — the encoding
// is identical across both chains, so any api works here.
function depositToBeneficiary({ api, transferToAddress }) {
  return {
    DepositAsset: {
      assets: { Wild: { AllCounted: 1 } },
      beneficiary: {
        parents: 0,
        interior: {
          X1: [
            getBeneficiaryJunction({
              api,
              transferToAddress,
            }),
          ],
        },
      },
    },
  };
}

function withdrawAllAssets(assetLocation) {
  return {
    WithdrawAsset: [{ id: assetLocation, fun: { Fungible: MAX_U128 } }],
  };
}

function buyExecution(assetLocation) {
  return {
    BuyExecution: {
      fees: { id: assetLocation, fun: { Fungible: MAX_U128 } },
      weight_limit: { Unlimited: null },
    },
  };
}

function padFeeByPercentage(fee, percent) {
  return fee + (fee * percent) / 100n;
}

function isFeesPaidEvent(event) {
  return (
    event.section?.toString?.() === "polkadotXcm" &&
    event.method?.toString?.() === "FeesPaid"
  );
}

function getFungibleAmount(fee) {
  const json = fee?.toJSON?.() ?? fee;
  return json?.fun?.Fungible ?? json?.fun?.fungible;
}

// Sums the `polkadotXcm.FeesPaid` amounts from the raw event codecs. The raw
// Codec objects are parsed directly because `emittedEvents.toJSON()` drops the
// section/method fields; FeesPaid data is a Tuple [paying, fees].
function getFeesPaidTotal(events) {
  let total = 0n;
  for (const event of events) {
    if (!isFeesPaidEvent(event)) continue;
    const fees = event.data?.fees ?? event.data?.toJSON?.()?.[1] ?? [];
    for (const fee of fees) {
      const amount = getFungibleAmount(fee);
      if (amount != null) total += BigInt(amount);
    }
  }
  return total;
}

// Extracts the first fungible amount from an xcm::VersionedAssets result — a
// V3/V4/V5 enum of asset lists. The versioned enum toJSONs as `{ v3: [...] }` /
// `{ v4: [...] }` / `{ v5: [...] }`; the inner MultiAssets is a plain array (V3
// wraps `Vec<MultiAsset>` directly, and polkadot-js decodes the V4/V5
// single-field struct as a bare Vec too — verified on-chain: Asset Hub returns
// V4 as an array). The `{ assets: [...] }` struct form is also handled
// defensively in case a runtime or type registration decodes it that way.
function getFirstFungibleAmount(result) {
  const json = result?.asOk?.toJSON?.();
  const inner = json && !Array.isArray(json) ? Object.values(json)[0] : json;
  const feeList = Array.isArray(inner) ? inner : inner?.assets;
  const fee = feeList?.find?.((entry) => entry?.fun?.fungible != null)?.fun
    ?.fungible;
  return fee != null ? BigInt(fee) : 0n;
}
