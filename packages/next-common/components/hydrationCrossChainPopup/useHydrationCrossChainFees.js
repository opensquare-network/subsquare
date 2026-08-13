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

// The tx hydration-ui builds the source fee from embeds a representative
// amount rather than the actual transfer amount: the SDK's Transfer quotes the
// fee with `amount = destinationFee + 1 wei` (see xc-sdk TransferBuilder
// getTransferData). The destination fee is denominated in the transferred
// asset, so the source-fee tx is built with that amount. Although the weight
// fee is amount-independent, the amount changes the compact-encoded tx length
// (and thus the length fee), so matching hydration-ui byte-for-byte requires
// the same amount. Falls back to the SDK's `10 wei` constant when the
// destination fee is unknown.
function getFeeEstimateAmount(destinationFeeAmount) {
  return destinationFeeAmount != null && destinationFeeAmount > 10n
    ? destinationFeeAmount + 1n
    : 10n;
}

// Upper bound of a fungible in XCM (u128::MAX), used in fee-quoting XCMs.
const AMOUNT_MAX = 340282366920938463463374607431768211455n;

// The xc-cfg XcmPaymentApi destination fee is padded by 20% before being
// surfaced (galacticcouncil/sdk `padFeeByPercentage`).
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

// The reserve (sovereign) account of the destination parachain on the source
// chain, mirroring the Galactic Council SDK's `getSovereignAccounts`: the
// ASCII bytes `"sibl"` followed by the parachain id as a u32 little-endian
// (the `Sibling` AccountIdConversion used by Asset Hub). hydration-ui's SDK
// dry-runs the transfer signed by this account to obtain the actual XCM
// delivery fee.
function getSiblingSovereignAccount(api, paraId) {
  const key = new Uint8Array(32);
  key.set([0x73, 0x69, 0x62, 0x6c]); // "sibl"
  new DataView(key.buffer).setUint32(4, paraId, true); // u32 little-endian
  return api.createType("AccountId32", key).toString();
}

// Estimates the XCM delivery fee the same way hydration-ui's SDK does: dry-run
// the actual transfer signed by the destination parachain's sovereign account
// and sum the `polkadotXcm.FeesPaid` events. Returns null when the dry-run API
// is unavailable or the simulation fails, letting the caller fall back to
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
      4,
    );
    if (!result.isOk || result.asOk.executionResult?.toJSON?.()?.err) {
      return null;
    }
    // Iterate the raw event codecs: `emittedEvents.toJSON()` drops the
    // section/method fields, so parse the Codec objects directly.
    const events = result.asOk.emittedEvents || [];
    let deliveryFee = 0n;
    for (const event of events) {
      if (
        event.section?.toString?.() === "polkadotXcm" &&
        event.method?.toString?.() === "FeesPaid"
      ) {
        // The FeesPaid data is a Tuple [paying, fees]; named fields are also
        // exposed on the codec (`data.fees`), else fall back to the array.
        const fees = event.data?.fees ?? event.data?.toJSON?.()?.[1];
        for (const fee of fees || []) {
          const json = fee?.toJSON?.() ?? fee;
          const amount = json?.fun?.Fungible ?? json?.fun?.fungible;
          if (amount != null) {
            deliveryFee += BigInt(amount);
          }
        }
      }
    }
    return deliveryFee;
  } catch (e) {
    console.error("Asset Hub delivery fee dry-run failed:", e);
    return null;
  }
}

// Builds the XCM that the destination chain executes for the transfer, as seen
// from the destination. Byte-identical to the Galactic Council SDK's
// `buildReserveTransfer` (WithdrawAsset, ClearOrigin, BuyExecution,
// DepositAsset, SetTopic) so the weight -> asset fee matches hydration-ui.
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
      {
        WithdrawAsset: [{ id: assetLocation, fun: { Fungible: AMOUNT_MAX } }],
      },
      { ClearOrigin: null },
      {
        BuyExecution: {
          fees: { id: assetLocation, fun: { Fungible: AMOUNT_MAX } },
          weight_limit: { Unlimited: null },
        },
      },
      {
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
      },
      {
        SetTopic:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
      },
    ],
  };
}

// Source chain fee, estimated on the source chain with its own runtime. The
// fee-quote tx embeds `destinationFeeAmount + 1 wei` of the transferred asset
// (see getFeeEstimateAmount), mirroring hydration-ui's Transfer build so the
// length fee matches byte-for-byte.
//
// - Asset Hub: charged in DOT (native). The XCM delivery fee is charged on top
//   of the extrinsic weight fee (usesDeliveryFee), so both are summed. The
//   delivery fee is quoted with a representative reserve-transfer XCM; it is
//   the dominant part of the fee (~0.03 DOT vs ~0.001 DOT weight fee).
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
    // hydration-ui's SDK estimates the delivery fee by dry-running the actual
    // transfer signed by the destination's sovereign account and reading the
    // `polkadotXcm.FeesPaid` events. Fall back to the XcmPaymentApi
    // queryDeliveryFees estimate when the dry-run API is unavailable or the
    // simulation fails.
    let deliveryFee = await estimateDeliveryFeeByDryRun({
      sourceApi,
      destinationChain,
      tx,
    });

    if (deliveryFee == null) {
      deliveryFee = 0n;

      // queryDeliveryFees is exposed by Asset Hub's metadata, but some API
      // instances (e.g. ones built from a stale cached metadata) may not
      // decorate it — degrade gracefully to the weight fee alone instead of
      // crashing the popup.
      if (
        typeof sourceApi.call?.xcmPaymentApi?.queryDeliveryFees === "function"
      ) {
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

          // Result: xcm::VersionedAssets — a V3/V4/V5 enum of asset lists.
          // Take the first fungible amount.
          const assets = result?.asOk?.toJSON?.();
          const feeList = Array.isArray(assets) ? assets : assets?.v4;
          const fee = feeList?.find?.((entry) => entry?.fun?.fungible != null)
            ?.fun?.fungible;
          deliveryFee = fee != null ? BigInt(fee) : 0n;
        } catch (e) {
          console.error("Asset Hub delivery fee query failed:", e);
        }
      } else {
        console.warn(
          "xcmPaymentApi.queryDeliveryFees is not available, showing the weight fee only",
        );
      }
    }

    return {
      amount: partialFee + deliveryFee,
      symbol: DOT_SYMBOL,
      decimals: getTransferAsset(DOT_SYMBOL).decimals,
    };
  }

  // Hydration source: resolve the fee currency, then convert the native fee.
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

// Destination chain fee.
//
// - Asset Hub -> Hydration: fixed values from the xc-cfg route configs,
//   denominated in the transferred asset.
// - Hydration -> Asset Hub: queried dynamically on Asset Hub via XcmPaymentApi
//   (queryXcmWeight -> queryWeightToAssetFee), padded by the same 20% margin
//   the SDK applies.
export async function estimateDestinationFee({
  destinationApi,
  destinationChain,
  symbol,
  transferToAddress,
}) {
  if (!isAssetHubChain(destinationChain)) {
    // Asset Hub -> Hydration: fixed config value.
    const config = HUB_TO_HYDRATION_DESTINATION_FEES[symbol];
    return { amount: config.amount, symbol, decimals: config.decimals };
  }

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

  const rawFee = BigInt(feeResult.asOk.toString());
  const margin = (rawFee * DESTINATION_FEE_MARGIN_PERCENT) / 100n;
  return {
    amount: rawFee + margin,
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
// Hub <-> Hydration transfer, mirroring the fee semantics of hydration-ui.
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
    // hydration-ui builds the source-fee quote tx with an amount of
    // `destinationFee + 1 wei` (see getFeeEstimateAmount), so the destination
    // fee is resolved first. A failure in one estimate must not blank the
    // other.
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
