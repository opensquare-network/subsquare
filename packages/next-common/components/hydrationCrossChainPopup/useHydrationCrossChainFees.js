import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { isAssetHubChain } from "next-common/utils/chain";
import buildHydrationCrossChainTx from "./teleportFromHydration";
import { HUB_TO_HYDRATION_DESTINATION_FEES } from "./transferAssets";
import {
  estimateAssetHubSourceFee,
  getAssetHubDestinationFee,
} from "./fees/assetHubFees";
import { estimateHydrationSourceFee } from "./fees/hydrationFees";

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

const FEE_ESTIMATE_DEBOUNCE_MS = 300;

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
async function estimateSourceFee({
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

  return isAssetHubChain(sourceChain)
    ? estimateAssetHubSourceFee({
        sourceApi,
        sourceChain,
        destinationChain,
        symbol,
        transferToAddress,
        tx,
        partialFee,
      })
    : estimateHydrationSourceFee({
        sourceApi,
        sourceChain,
        address,
        partialFee,
        weight: info.weight,
        nativeSymbol,
        nativeDecimals,
      });
}

// Destination chain fee.
//
// - Asset Hub -> Hydration: fixed values denominated in the transferred asset.
// - Hydration -> Asset Hub: queried dynamically on Asset Hub via XcmPaymentApi
//   (queryXcmWeight -> queryWeightToAssetFee), padded by the same 20% margin.
async function estimateDestinationFee({
  destinationApi,
  destinationChain,
  symbol,
  transferToAddress,
}) {
  if (!isAssetHubChain(destinationChain)) {
    const config = HUB_TO_HYDRATION_DESTINATION_FEES[symbol];
    return { amount: config.amount, symbol, decimals: config.decimals };
  }

  return getAssetHubDestinationFee({
    destinationApi,
    destinationChain,
    symbol,
    transferToAddress,
  });
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
    const timeoutId = setTimeout(async () => {
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
    }, FEE_ESTIMATE_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
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
