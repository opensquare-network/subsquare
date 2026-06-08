import React, { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import { useChainSettings } from "next-common/context/chain";
import PopupLabel from "../label";
import MaybeProxySigner, { ConnectedAccountSigner } from "../../signer";
import ExtensionUpdatePrompt from "next-common/components/overview/accountInfo/components/extensionUpdatePrompt";
import {
  useFeeAssetType,
  FEE_ASSET_TYPES,
  STABLE_COIN_DECIMALS,
  USDC_ASSET_ID,
  USDT_ASSET_ID,
} from "next-common/components/popupWithSigner/context/feeAsset";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import { useGasFeeEstimate } from "next-common/components/estimatedGas";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { PromptTypes, colorStyle } from "next-common/components/scrollPrompt";

function SignerWrapper({
  title = "Origin",
  balanceName = "Balance",
  symbol,
  balance,
  isBalanceLoading,
  showTransferable = false,
  children,
}) {
  const node = useChainSettings();
  const noBalance = isNil(balance) && isNil(isBalanceLoading);

  // Fee asset state
  const { feeAssetType } = useFeeAssetType();
  const signerAccount = useSignerAccount();
  const assetHubApi = useAssetHubApi();
  const [gasFeeEstimate] = useGasFeeEstimate();
  const assetId =
    feeAssetType === FEE_ASSET_TYPES.USDC ? USDC_ASSET_ID : USDT_ASSET_ID;
  const [stableCoinBalance, setStableCoinBalance] = useState(null);
  const [isBalanceLoadingStable, setIsBalanceLoadingStable] = useState(false);

  useEffect(() => {
    if (!assetHubApi || !signerAccount?.realAddress) {
      setStableCoinBalance(null);
      return;
    }
    setIsBalanceLoadingStable(true);
    assetHubApi.query.assets
      .account(assetId, signerAccount.realAddress)
      .then((data) => {
        setStableCoinBalance(data ? BigInt(data.balance.toString()) : 0n);
      })
      .catch(() => setStableCoinBalance(null))
      .finally(() => setIsBalanceLoadingStable(false));
  }, [assetHubApi, signerAccount?.realAddress, assetId]);

  const assetLabel = feeAssetType === FEE_ASSET_TYPES.USDC ? "USDC" : "USDT";
  const feeAmount = gasFeeEstimate?.amount;
  const feeAssetTypeMatches = gasFeeEstimate?.assetType === feeAssetType;
  const isFeeReady =
    !gasFeeEstimate?.isLoading && feeAmount != null && feeAssetTypeMatches;
  const formattedFee = isFeeReady
    ? toPrecision(feeAmount, STABLE_COIN_DECIMALS, 4)
    : null;
  const isInsufficient =
    isFeeReady &&
    !isBalanceLoadingStable &&
    stableCoinBalance != null &&
    BigInt(stableCoinBalance) < BigInt(feeAmount);

  return (
    <div>
      <ExtensionUpdatePrompt isWithCache={false} />

      {feeAssetType !== FEE_ASSET_TYPES.native && !isInsufficient && (
        <GreyPanel
          className="text14Medium py-2.5 px-4 mb-2"
          style={colorStyle[PromptTypes.NEUTRAL]}
        >
          Transaction fee will be paid in{" "}
          {formattedFee
            ? `${assetLabel} (≈ ${formattedFee} ${assetLabel})`
            : assetLabel}
        </GreyPanel>
      )}

      {feeAssetType !== FEE_ASSET_TYPES.native && isInsufficient && (
        <GreyPanel
          className="text14Medium py-2.5 px-4 mb-2"
          style={colorStyle[PromptTypes.ERROR]}
        >
          Insufficient {assetLabel} balance to pay the transaction fee
          {formattedFee ? ` (≈ ${formattedFee} ${assetLabel} needed)` : ""}
        </GreyPanel>
      )}

      {noBalance ? (
        <PopupLabel text={title || "Origin"} />
      ) : (
        <PopupLabelWithBalance
          text={title || "Origin"}
          isLoading={isBalanceLoading}
          balanceName={balanceName}
          balance={toPrecision(balance ?? 0, node.decimals)}
          symbol={symbol || node.symbol}
          showTransferable={showTransferable}
        />
      )}
      {children}
    </div>
  );
}

export function ConnectedSigner({
  title = "Origin",
  balanceName = "Balance",
  symbol,
  balance,
  isBalanceLoading,
  showTransferable = false,
}) {
  return (
    <SignerWrapper
      title={title}
      balanceName={balanceName}
      symbol={symbol}
      balance={balance}
      isBalanceLoading={isBalanceLoading}
      showTransferable={showTransferable}
    >
      <ConnectedAccountSigner />
    </SignerWrapper>
  );
}

export default function Signer({
  title = "Origin",
  balanceName = "Balance",
  symbol,
  balance,
  isBalanceLoading,
  noSwitchSigner = false,
  showTransferable = false,
  supportedMultisig = true,
}) {
  return (
    <SignerWrapper
      title={title}
      balanceName={balanceName}
      symbol={symbol}
      balance={balance}
      isBalanceLoading={isBalanceLoading}
      showTransferable={showTransferable}
    >
      <MaybeProxySigner
        noSwitch={noSwitchSigner}
        supportedMultisig={supportedMultisig}
      />
    </SignerWrapper>
  );
}
