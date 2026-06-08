import React, { useEffect, useState } from "react";
import { toPrecision } from "next-common/utils";
import {
  useFeeAssetType,
  FEE_ASSET_TYPES,
  STABLE_COIN_DECIMALS,
  USDC_ASSET_ID,
  USDT_ASSET_ID,
} from "next-common/components/popupWithSigner/context/feeAsset";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useGasFeeEstimate } from "next-common/components/estimatedGas";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { PromptTypes, colorStyle } from "next-common/components/scrollPrompt";

function FeeAssetPromptInfo({ assetLabel, formattedFee }) {
  return (
    <GreyPanel
      className="w-[calc(100%+50px)] right-[25px] relative rounded-none px-6 py-4 text14Medium"
      style={colorStyle[PromptTypes.INFO]}
    >
      Transaction fee will be paid in{" "}
      {formattedFee
        ? `${assetLabel} (≈ ${formattedFee} ${assetLabel})`
        : assetLabel}
    </GreyPanel>
  );
}

function FeeAssetPromptError({ assetLabel, formattedFee }) {
  return (
    <GreyPanel
      className="w-[calc(100%+50px)] right-[25px] relative rounded-none px-6 py-4 text14Medium"
      style={colorStyle[PromptTypes.ERROR]}
    >
      Insufficient {assetLabel} balance to pay the transaction fee
      {formattedFee ? ` (≈ ${formattedFee} ${assetLabel} needed)` : ""}
    </GreyPanel>
  );
}

function useAssetBalance(api, assetId, address) {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!api || !address) {
      setBalance(null);
      return;
    }
    setIsLoading(true);
    api.query.assets
      .account(assetId, address)
      .then((data) => {
        const b = data?.balance;
        setBalance(b != null ? BigInt(b.toString()) : 0n);
      })
      .catch(() => setBalance(0n))
      .finally(() => setIsLoading(false));
  }, [api, address, assetId]);

  return { balance, isLoading };
}

function getFeeAssetInfo(feeAssetType) {
  if (feeAssetType === FEE_ASSET_TYPES.USDC) {
    return { id: USDC_ASSET_ID, label: "USDC" };
  }
  if (feeAssetType === FEE_ASSET_TYPES.USDT) {
    return { id: USDT_ASSET_ID, label: "USDT" };
  }
  return { id: null, label: null };
}

function isFeeEstimateReady(gasFeeEstimate, feeAssetType) {
  return (
    !gasFeeEstimate?.isLoading &&
    gasFeeEstimate?.amount != null &&
    gasFeeEstimate?.assetType === feeAssetType
  );
}

export default function FeeAssetPrompts() {
  const { feeAssetType } = useFeeAssetType();
  const signerAccount = useSignerAccount();
  const api = useContextApi();
  const [gasFeeEstimate] = useGasFeeEstimate();

  const { id: assetId, label: assetLabel } = getFeeAssetInfo(feeAssetType);
  const { balance: feeAssetBalance, isLoading: isBalanceLoading } =
    useAssetBalance(api, assetId, signerAccount?.realAddress);

  if (feeAssetType === FEE_ASSET_TYPES.native) {
    return null;
  }

  const isFeeReady = isFeeEstimateReady(gasFeeEstimate, feeAssetType);
  const formattedFee = isFeeReady
    ? toPrecision(gasFeeEstimate.amount, STABLE_COIN_DECIMALS, 4)
    : null;
  const isInsufficient =
    isFeeReady &&
    !isBalanceLoading &&
    feeAssetBalance != null &&
    BigInt(feeAssetBalance) < BigInt(gasFeeEstimate.amount);

  if (isInsufficient) {
    return (
      <FeeAssetPromptError
        assetLabel={assetLabel}
        formattedFee={formattedFee}
      />
    );
  }

  return (
    <FeeAssetPromptInfo assetLabel={assetLabel} formattedFee={formattedFee} />
  );
}
