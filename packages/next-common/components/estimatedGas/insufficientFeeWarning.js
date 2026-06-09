import React from "react";
import {
  useNativeBalance,
  useAssetBalance,
  FEE_ASSET_TYPES,
} from "next-common/components/popupWithSigner/context/feeAsset";

function NativeInsufficientWarning({ gasFee, isGasFeeLoading, symbol }) {
  const { balance: feeAssetBalance } = useNativeBalance();

  const isInsufficient =
    !isGasFeeLoading &&
    gasFee != null &&
    feeAssetBalance != null &&
    BigInt(feeAssetBalance) < BigInt(gasFee);

  if (!isInsufficient) return null;

  return (
    <span className="text12Medium text-red500 ml-4">
      Insufficient {symbol} balance to pay the transaction fee
    </span>
  );
}

function AssetInsufficientWarning({
  gasFee,
  isGasFeeLoading,
  assetId,
  symbol,
}) {
  const { balance: feeAssetBalance, isLoading } = useAssetBalance(assetId);

  const isInsufficient =
    !isGasFeeLoading &&
    !isLoading &&
    gasFee != null &&
    feeAssetBalance != null &&
    BigInt(feeAssetBalance) < BigInt(gasFee);

  if (!isInsufficient) return null;

  return (
    <span className="text12Medium text-red500 ml-4">
      Insufficient {symbol} balance to pay the transaction fee
    </span>
  );
}

export default function InsufficientFeeWarning({
  feeAssetType,
  feeAssetInfo,
  gasFee,
  isGasFeeLoading,
}) {
  if (feeAssetType === FEE_ASSET_TYPES.native) {
    return (
      <NativeInsufficientWarning
        gasFee={gasFee}
        isGasFeeLoading={isGasFeeLoading}
        symbol={feeAssetInfo.symbol}
      />
    );
  }

  return (
    <AssetInsufficientWarning
      gasFee={gasFee}
      isGasFeeLoading={isGasFeeLoading}
      assetId={feeAssetInfo.assetId}
      symbol={feeAssetInfo.symbol}
    />
  );
}
