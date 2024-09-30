import React from "react";
import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import { useChainSettings } from "next-common/context/chain";
import PopupLabel from "../label";
import ConnectedSigner from "../../connectedSigner";
import ProxyInfo from "../proxyInfo";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";

export default function Signer({
  isBalanceLoading,
  balance,
  balanceName = "Balance",
  symbol,
  signerBalance,
  isSignerBalanceLoading,
  title = "Origin",
}) {
  const signerAccount = useSignerAccount();
  const node = useChainSettings();
  const noSignerBalance = isNil(signerBalance) && isNil(isSignerBalanceLoading);
  const noVotingBalance = isNil(balance) && isNil(isBalanceLoading);

  return (
    <div>
      {noSignerBalance ? (
        <PopupLabel text={title || "Origin"} />
      ) : (
        <PopupLabelWithBalance
          text={title || "Origin"}
          isLoading={isSignerBalanceLoading}
          balanceName={balanceName}
          balance={toPrecision(signerBalance ?? 0, node.decimals)}
          symbol={symbol || node.symbol}
        />
      )}
      <ConnectedSigner />
      {signerAccount?.proxyAddress &&
        (noVotingBalance ? (
          <ProxyInfo address={signerAccount.proxyAddress} />
        ) : (
          <ProxyInfo
            address={signerAccount.proxyAddress}
            balance={toPrecision(balance ?? 0, node.decimals)}
            isLoading={isBalanceLoading}
            symbol={symbol || node.symbol}
          />
        ))}
    </div>
  );
}
