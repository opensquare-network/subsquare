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

// Fee placeholder used when building the tx for fee estimation. Both the
// weight fee and the XCM fees are amount-independent (weight/proof based), so
// a fixed placeholder keeps the estimate decoupled from the amount input.
const ESTIMATE_AMOUNT = "1";

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

// Builds the XCM that the destination chain executes for the transfer, as seen
// from the destination. Same shape the Galactic Council SDK builds for fee
// queries: WithdrawAsset, ClearOrigin, BuyExecution, DepositAsset.
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
    ],
  };
}

// Source chain fee, estimated on the source chain with its own runtime.
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
}) {
  const tx = buildHydrationCrossChainTx({
    sourceApi,
    sourceChain,
    destinationChain,
    transferToAddress,
    amount: ESTIMATE_AMOUNT,
    symbol,
  });

  const info = await tx.paymentInfo(address);
  const partialFee = BigInt(info.partialFee.toString());

  if (isAssetHubChain(sourceChain)) {
    let deliveryFee = 0n;

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

        // Result: Vec<XcmAsset> — take the first fungible amount.
        const fee = result?.asOk
          ?.toJSON?.()
          ?.v4?.find((entry) => entry?.fun?.fungible != null)?.fun?.fungible;
        deliveryFee = fee != null ? BigInt(fee) : 0n;
      } catch (e) {
        console.error("Asset Hub delivery fee query failed:", e);
      }
    } else {
      console.warn(
        "xcmPaymentApi.queryDeliveryFees is not available, showing the weight fee only",
      );
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

    // allSettled: the two fees are independent — a failure in one (e.g. a
    // runtime call not decorated) must not blank the other.
    Promise.allSettled([
      estimateSourceFee({ ...args, sourceApi, sourceChain, destinationChain }),
      estimateDestinationFee({
        ...args,
        destinationApi,
        destinationChain,
      }),
    ]).then(([sourceResult, destinationResult]) => {
      if (cancelled) return;
      setSourceFee(
        sourceResult.status === "fulfilled" ? sourceResult.value : null,
      );
      setDestinationFee(
        destinationResult.status === "fulfilled"
          ? destinationResult.value
          : null,
      );
      if (sourceResult.status === "rejected") {
        console.error("Source chain fee estimate failed:", sourceResult.reason);
      }
      if (destinationResult.status === "rejected") {
        console.error(
          "Destination chain fee estimate failed:",
          destinationResult.reason,
        );
      }
      setIsLoading(false);
    });

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
