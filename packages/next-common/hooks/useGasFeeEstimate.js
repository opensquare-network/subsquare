import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import {
  FEE_ASSET_TYPES,
  getFeeAssetXcmLocation,
} from "next-common/components/popupWithSigner/context/feeAsset";

async function convertFeeToAsset(api, partialFee, weight, feeAssetType) {
  if (feeAssetType === FEE_ASSET_TYPES.native) {
    return partialFee;
  }

  if (!api?.call?.transactionPaymentApi?.queryWeightToFee) {
    throw new Error("transactionPaymentApi not available on this chain");
  }
  if (!api?.call?.xcmPaymentApi?.queryWeightToAssetFee) {
    throw new Error("xcmPaymentApi not available on this chain");
  }

  const location = getFeeAssetXcmLocation(feeAssetType);
  if (!location) {
    return partialFee;
  }

  const weightFeeBn = await api.call.transactionPaymentApi.queryWeightToFee(
    weight,
  );
  const nativeWeightFee = BigInt(weightFeeBn.toString());

  const assetWeightFeeResult =
    await api.call.xcmPaymentApi.queryWeightToAssetFee(weight, location);

  if (!assetWeightFeeResult.isOk) {
    throw new Error(`queryWeightToAssetFee failed for ${feeAssetType}`);
  }

  const assetWeightFee = BigInt(assetWeightFeeResult.asOk.toString());
  const nativePartialFee = BigInt(partialFee.toString());

  return (nativePartialFee * assetWeightFee) / nativeWeightFee;
}

export default function useGasFeeEstimate(getTxFunc, feeAssetType) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const [tx, setTx] = useState(null);
  const [gasFee, setGasFee] = useState(null);
  const [isGasFeeLoading, setIsGasFeeLoading] = useState(false);

  // Clear stale gasFee synchronously before paint on feeAssetType switch
  const prevFeeAssetType = useRef(feeAssetType);
  useLayoutEffect(() => {
    if (prevFeeAssetType.current !== feeAssetType) {
      setGasFee(null);
      prevFeeAssetType.current = feeAssetType;
    }
  }, [feeAssetType]);

  // Build tx from getTxFunc
  useEffect(() => {
    if (typeof getTxFunc !== "function") {
      return;
    }
    Promise.resolve()
      .then(getTxFunc)
      .then(setTx)
      .catch(() => setTx(null));
  }, [getTxFunc]);

  const address = signerAccount?.realAddress;

  // Estimate fee
  useEffect(() => {
    if (!api || !tx || !address) {
      setGasFee(null);
      setIsGasFeeLoading(false);
      return;
    }

    let cancelled = false;
    setGasFee(null);
    setIsGasFeeLoading(true);

    tx.paymentInfo(address)
      .then(async (info) => {
        if (cancelled) return;

        if (feeAssetType === FEE_ASSET_TYPES.native) {
          setGasFee(info.partialFee);
          return;
        }

        const convertedFee = await convertFeeToAsset(
          api,
          info.partialFee,
          info.weight,
          feeAssetType,
        );

        if (!cancelled) setGasFee(convertedFee);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Fee conversion error:", err);
          setGasFee(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsGasFeeLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [api, tx, address, feeAssetType]);

  return { gasFee, isGasFeeLoading, tx };
}
