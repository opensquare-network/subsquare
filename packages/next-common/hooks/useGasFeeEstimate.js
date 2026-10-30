import { useEffect, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "react-use";
import { useContextApi } from "next-common/context/api";
import {
  NATIVE_ASSET_TYPE,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { useFeeAssetInfo } from "next-common/components/popupWithSigner/context/feeAsset";

async function convertFeeToAsset(api, partialFee, weight, location) {
  if (!location) {
    return partialFee;
  }

  if (!api?.call?.transactionPaymentApi?.queryWeightToFee) {
    throw new Error("transactionPaymentApi not available on this chain");
  }
  if (!api?.call?.xcmPaymentApi?.queryWeightToAssetFee) {
    throw new Error("xcmPaymentApi not available on this chain");
  }

  const weightFeeBn = await api.call.transactionPaymentApi.queryWeightToFee(
    weight,
  );
  const nativeWeightFee = BigInt(weightFeeBn.toString());

  const assetWeightFeeResult =
    await api.call.xcmPaymentApi.queryWeightToAssetFee(weight, location);

  if (!assetWeightFeeResult.isOk) {
    throw new Error("queryWeightToAssetFee failed");
  }

  const assetWeightFee = BigInt(assetWeightFeeResult.asOk.toString());
  const nativePartialFee = BigInt(partialFee.toString());

  return (nativePartialFee * assetWeightFee) / nativeWeightFee;
}

export default function useGasFeeEstimate(getTxFunc, feeAssetType) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const { location } = useFeeAssetInfo(feeAssetType);
  const [tx, setTx] = useState(null);
  const [gasFee, setGasFee] = useState(null);
  const [isGasFeeLoading, setIsGasFeeLoading] = useState(false);

  // Clear stale gasFee synchronously before paint on feeAssetType switch
  const prevFeeAssetType = useRef(feeAssetType);
  useIsomorphicLayoutEffect(() => {
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

    // getTxFunc may return several transactions (e.g. a batch split by the
    // block weight limit); estimate them all and show the total.
    const txs = Array.isArray(tx) ? tx : [tx];

    Promise.all(txs.map((item) => item.paymentInfo(address)))
      .then(async (infos) => {
        if (cancelled) return;

        if (infos.length === 0) {
          setGasFee(null);
          return;
        }

        if (feeAssetType === NATIVE_ASSET_TYPE) {
          const totalFee = infos
            .map((info) => info.partialFee)
            .reduce((sum, fee) => sum.add(fee));
          setGasFee(totalFee);
          return;
        }

        let totalFee = null;
        for (const info of infos) {
          const convertedFee = await convertFeeToAsset(
            api,
            info.partialFee,
            info.weight,
            location,
          );
          const value =
            typeof convertedFee === "bigint"
              ? convertedFee
              : BigInt(convertedFee.toString());
          totalFee = totalFee === null ? value : totalFee + value;
        }
        if (!cancelled) setGasFee(totalFee);
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
  }, [api, tx, address, feeAssetType, location]);

  return { gasFee, isGasFeeLoading, tx };
}
