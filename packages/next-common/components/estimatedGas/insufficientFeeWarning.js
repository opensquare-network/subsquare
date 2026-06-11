import React from "react";
import {
  useNativeBalance,
  useAssetBalance,
  useForeignAssetBalance,
  NATIVE_ASSET_TYPE,
} from "next-common/components/popupWithSigner/context/feeAsset";

function InsufficientFeeBalanceWarning({
  gasFee,
  isGasFeeLoading,
  balance,
  isLoading,
  symbol,
}) {
  const isInsufficient =
    !isGasFeeLoading &&
    !isLoading &&
    gasFee != null &&
    balance != null &&
    BigInt(balance) < BigInt(gasFee);

  if (!isInsufficient) return null;

  return (
    <span className="text12Medium text-red500 ml-4">
      Insufficient {symbol} balance to pay the transaction fee
    </span>
  );
}

function NativeInsufficientWarning({ gasFee, isGasFeeLoading, symbol }) {
  const { balance, isLoading } = useNativeBalance();

  return (
    <InsufficientFeeBalanceWarning
      gasFee={gasFee}
      isGasFeeLoading={isGasFeeLoading}
      balance={balance}
      isLoading={isLoading}
      symbol={symbol}
    />
  );
}

function AssetInsufficientWarning({
  gasFee,
  isGasFeeLoading,
  assetId,
  symbol,
}) {
  const { balance, isLoading } = useAssetBalance(assetId);

  return (
    <InsufficientFeeBalanceWarning
      gasFee={gasFee}
      isGasFeeLoading={isGasFeeLoading}
      balance={balance}
      isLoading={isLoading}
      symbol={symbol}
    />
  );
}

function ForeignAssetInsufficientWarning({
  gasFee,
  isGasFeeLoading,
  location,
  symbol,
}) {
  const { balance, isLoading } = useForeignAssetBalance(location);

  return (
    <InsufficientFeeBalanceWarning
      gasFee={gasFee}
      isGasFeeLoading={isGasFeeLoading}
      balance={balance}
      isLoading={isLoading}
      symbol={symbol}
    />
  );
}

export default function InsufficientFeeWarning({
  feeAssetType,
  feeAssetInfo,
  gasFee,
  isGasFeeLoading,
}) {
  if (feeAssetType === NATIVE_ASSET_TYPE) {
    return (
      <NativeInsufficientWarning
        gasFee={gasFee}
        isGasFeeLoading={isGasFeeLoading}
        symbol={feeAssetInfo.symbol}
      />
    );
  }

  if (feeAssetInfo.type === "foreignAsset") {
    return (
      <ForeignAssetInsufficientWarning
        gasFee={gasFee}
        isGasFeeLoading={isGasFeeLoading}
        location={feeAssetInfo.location}
        symbol={feeAssetInfo.symbol}
      />
    );
  }

  if (feeAssetInfo.type === "asset") {
    return (
      <AssetInsufficientWarning
        gasFee={gasFee}
        isGasFeeLoading={isGasFeeLoading}
        assetId={feeAssetInfo.assetId}
        symbol={feeAssetInfo.symbol}
      />
    );
  }

  return null;
}
