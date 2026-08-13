import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { isAssetHubChain } from "next-common/utils/chain";
import buildHydrationCrossChainTx, {
  getBeneficiaryJunction,
  getParaChainId,
} from "./teleportFromHydration";
import {
  DOT_SYMBOL,
  USDC_SYMBOL,
  USDT_SYMBOL,
  getTransferAsset,
  getTransferAssetLocation,
  HUB_TO_HYDRATION_DESTINATION_FEES,
} from "./transferAssets";

// 2^128 - 1 (u128::MAX) — the "withdraw everything" amount in fee-quoting XCMs.
const MAX_U128 = 2n ** 128n - 1n;

// The source fee is quoted with `amount = destinationFee + 1 wei` so the
// compact-encoded tx length (and thus the length fee) matches. The amount
// falls back to this minimum when the destination fee is unknown.
const FEE_QUOTE_MIN_AMOUNT = 10n;
const FEE_QUOTE_AMOUNT_PADDING = 1n;

function getFeeEstimateAmount(destinationFeeAmount) {
  const hasDestinationFee =
    destinationFeeAmount != null && destinationFeeAmount > FEE_QUOTE_MIN_AMOUNT;
  return hasDestinationFee
    ? destinationFeeAmount + FEE_QUOTE_AMOUNT_PADDING
    : FEE_QUOTE_MIN_AMOUNT;
}

// The destination fee is padded by 20% before being surfaced.
const DESTINATION_FEE_MARGIN_PERCENT = 20n;

// Hydration's MultiTransactionPayment currency ids for the supported symbols
// (verified on-chain against assetRegistry: DOT=5, USDT=10, USDC=22).
const HYDRATION_FEE_CURRENCY_IDS = {
  [DOT_SYMBOL]: 5,
  [USDC_SYMBOL]: 22,
  [USDT_SYMBOL]: 10,
};

function getFeeAssetLocation({ chain, symbol }) {
  return { V4: getTransferAssetLocation({ sourceChain: chain, symbol }) };
}

// Asset Hub derives a sibling parachain's sovereign account as the ASCII bytes
// "sibl" followed by the u32 little-endian paraId (the `Sibling`
// AccountIdConversion used by Asset Hub).
const SIBLING_ACCOUNT_PREFIX = "sibl";
const SIBLING_ACCOUNT_PREFIX_LENGTH = 4;

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

const DRY_RUN_CALL_FLAGS = 4;

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
      DRY_RUN_CALL_FLAGS,
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

function depositToBeneficiary({
  destinationApi,
  destinationChain,
  transferToAddress,
}) {
  return {
    DepositAsset: {
      assets: { Wild: { AllCounted: 1 } },
      beneficiary: {
        parents: 0,
        interior: {
          X1: [
            getBeneficiaryJunction({
              api: destinationApi,
              destinationChain,
              transferToAddress,
            }),
          ],
        },
      },
    },
  };
}

const EMPTY_TOPIC =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

// Builds the XCM the destination chain executes for the transfer, as seen from
// the destination (WithdrawAsset, ClearOrigin, BuyExecution, DepositAsset,
// SetTopic), used to quote the weight -> asset fee.
function buildDestinationFeeXcm({
  destinationApi,
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
        destinationApi,
        destinationChain,
        transferToAddress,
      }),
      { SetTopic: EMPTY_TOPIC },
    ],
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
        destinationApi: sourceApi,
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

// Extracts the first fungible amount from an xcm::VersionedAssets result — a
// V3/V4/V5 enum of asset lists.
function getFirstFungibleAmount(result) {
  const assets = result?.asOk?.toJSON?.();
  const feeList = Array.isArray(assets) ? assets : assets?.v4;
  const fee = feeList?.find?.((entry) => entry?.fun?.fungible != null)?.fun
    ?.fungible;
  return fee != null ? BigInt(fee) : 0n;
}

// Hydration source fee: resolve the signer's fee currency, then convert the
// native fee into it when a supported currency is configured.
async function estimateHydrationSourceFee({
  sourceApi,
  sourceChain,
  address,
  info,
  partialFee,
  nativeSymbol,
  nativeDecimals,
}) {
  const {
    symbol: feeSymbol,
    decimals: feeDecimals,
    location,
  } = await getHydrationFeeCurrency({
    api: sourceApi,
    sourceChain,
    address,
    nativeSymbol,
    nativeDecimals,
  });

  if (!location) {
    return { amount: partialFee, symbol: feeSymbol, decimals: feeDecimals };
  }

  try {
    const converted = await convertNativeFeeToAsset({
      api: sourceApi,
      partialFee: info.partialFee,
      weight: info.weight,
      location,
    });
    return { amount: converted, symbol: feeSymbol, decimals: feeDecimals };
  } catch (e) {
    console.error("Hydration fee currency conversion failed:", e);
    return {
      amount: partialFee,
      symbol: nativeSymbol,
      decimals: nativeDecimals,
    };
  }
}

// Source chain fee, estimated on the source chain with its own runtime. The
// fee-quote tx embeds `destinationFeeAmount + 1 wei` of the transferred asset
// (see getFeeEstimateAmount) so the compact-encoded tx length matches.
//
// - Asset Hub: charged in DOT (native). The XCM delivery fee is charged on top
//   of the extrinsic weight fee (usesDeliveryFee), so both are summed.
// - Hydration: charged in the signer's MultiTransactionPayment currency
//   (native HDX by default). Hydration quotes no delivery fee (verified:
//   queryDeliveryFees returns an empty list), so only the weight fee applies;
//   it is converted from the native HDX fee to the fee currency when one is
//   configured.
export async function estimateSourceFee({
  sourceApi,
  sourceChain,
  destinationChain,
  symbol,
  address,
  transferToAddress,
  nativeSymbol,
  nativeDecimals,
  destinationFeeAmount,
}) {
  const tx = buildHydrationCrossChainTx({
    sourceApi,
    sourceChain,
    destinationChain,
    transferToAddress,
    amount: getFeeEstimateAmount(destinationFeeAmount),
    symbol,
  });

  const info = await tx.paymentInfo(address);
  const partialFee = BigInt(info.partialFee.toString());

  if (isAssetHubChain(sourceChain)) {
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

  return estimateHydrationSourceFee({
    sourceApi,
    sourceChain,
    address,
    info,
    partialFee,
    nativeSymbol,
    nativeDecimals,
  });
}

// The destination fee on Asset Hub, quoted via XcmPaymentApi
// (queryXcmWeight -> queryWeightToAssetFee), in the transferred asset.
async function getAssetHubDestinationFee({
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
      destinationApi,
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

function padFeeByPercentage(fee, percent) {
  return fee + (fee * percent) / 100n;
}

// Destination chain fee.
//
// - Asset Hub -> Hydration: fixed values denominated in the transferred asset.
// - Hydration -> Asset Hub: queried dynamically on Asset Hub via XcmPaymentApi
//   (queryXcmWeight -> queryWeightToAssetFee), padded by the same 20% margin.
export async function estimateDestinationFee({
  destinationApi,
  destinationChain,
  symbol,
  transferToAddress,
}) {
  if (!isAssetHubChain(destinationChain)) {
    const config = HUB_TO_HYDRATION_DESTINATION_FEES[symbol];
    return { amount: config.amount, symbol, decimals: config.decimals };
  }

  const rawFee = await getAssetHubDestinationFee({
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

// Resolves the fee currency a Hydration account pays with. Returns the native
// currency when none is configured; the `location` (XcmVersionedAssetId) is
// only set for supported symbols, which is what enables the fee conversion.
async function getHydrationFeeCurrency({
  api,
  sourceChain,
  address,
  nativeSymbol,
  nativeDecimals,
}) {
  let assetId = 0;
  try {
    const currency =
      await api.query.multiTransactionPayment?.accountCurrencyMap?.(address);
    assetId = currency?.isSome ? Number(currency.unwrap().toString()) : 0;
  } catch (e) {
    console.error("MultiTransactionPayment query failed:", e);
    assetId = 0;
  }

  if (assetId === 0) {
    return { symbol: nativeSymbol, decimals: nativeDecimals, location: null };
  }

  const known = Object.entries(HYDRATION_FEE_CURRENCY_IDS).find(
    ([, id]) => id === assetId,
  );
  if (known) {
    const [symbol] = known;
    const asset = getTransferAsset(symbol);
    return {
      symbol,
      decimals: asset.decimals,
      location: getFeeAssetLocation({ chain: sourceChain, symbol }),
    };
  }

  // Unsupported fee currency: fall back to showing the native HDX fee.
  console.warn(
    `Unsupported Hydration fee currency id ${assetId}, falling back to ${nativeSymbol}`,
  );
  return { symbol: nativeSymbol, decimals: nativeDecimals, location: null };
}

// Converts a native-asset weight fee into the requested fee asset, using the
// weight-based conversion (same approach as next-common/hooks/useGasFeeEstimate).
async function convertNativeFeeToAsset({ api, partialFee, weight, location }) {
  const weightFee = await api.call.transactionPaymentApi.queryWeightToFee(
    weight,
  );
  const nativeWeightFee = BigInt(weightFee.toString());

  const assetWeightFeeResult =
    await api.call.xcmPaymentApi.queryWeightToAssetFee(weight, location);
  if (!assetWeightFeeResult.isOk) {
    throw new Error("queryWeightToAssetFee failed");
  }

  const assetWeightFee = BigInt(assetWeightFeeResult.asOk.toString());
  const nativePartialFee = BigInt(partialFee.toString());
  return (nativePartialFee * assetWeightFee) / nativeWeightFee;
}

// Estimates the source chain fee and the destination chain fee for the Asset
// Hub <-> Hydration transfer.
export default function useHydrationCrossChainFees({
  sourceApi,
  destinationApi,
  sourceChain,
  destinationChain,
  symbol,
  address,
  transferToAddress,
}) {
  const { symbol: nativeSymbol, decimals: nativeDecimals } = useChainSettings();
  const [sourceFee, setSourceFee] = useState(null);
  const [destinationFee, setDestinationFee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sourceApi || !destinationApi || !address || !transferToAddress) {
      setSourceFee(null);
      setDestinationFee(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const args = {
      symbol,
      address,
      transferToAddress,
      nativeSymbol,
      nativeDecimals,
    };

    // The destination fee is needed before the source fee can be estimated:
    // the source-fee quote tx embeds `destinationFee + 1 wei` (see
    // getFeeEstimateAmount), so the destination fee is resolved first. A
    // failure in one estimate must not blank the other.
    (async () => {
      const destResult = await estimateDestinationFee({
        ...args,
        destinationApi,
        destinationChain,
      }).catch((e) => {
        console.error("Destination chain fee estimate failed:", e);
        return null;
      });

      const sourceResult = await estimateSourceFee({
        ...args,
        sourceApi,
        sourceChain,
        destinationChain,
        destinationFeeAmount: destResult?.amount,
      }).catch((e) => {
        console.error("Source chain fee estimate failed:", e);
        return null;
      });

      if (cancelled) return;
      setDestinationFee(destResult);
      setSourceFee(sourceResult);
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [
    sourceApi,
    destinationApi,
    sourceChain,
    destinationChain,
    symbol,
    address,
    transferToAddress,
    nativeSymbol,
    nativeDecimals,
  ]);

  return { sourceFee, destinationFee, isLoading };
}
