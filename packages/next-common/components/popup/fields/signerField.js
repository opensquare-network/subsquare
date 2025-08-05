import React, { useMemo } from "react";
import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import { useChainSettings } from "next-common/context/chain";
import PopupLabel from "../label";
import MaybeProxySigner, { ConnectedAccountSigner } from "../../signer";
import ExtensionUpdatePrompt from "next-common/components/overview/accountInfo/components/extensionUpdatePrompt";

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

  return (
    <div>
      <ExtensionUpdatePrompt isWithCache={false} />

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
  const isBalanceUnavailable = useMemo(() => isNil(balance), [balance]);

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
        noSwitch={noSwitchSigner || isBalanceUnavailable}
        supportedMultisig={supportedMultisig}
      />
    </SignerWrapper>
  );
}
