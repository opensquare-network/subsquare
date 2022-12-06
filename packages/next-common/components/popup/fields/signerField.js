import React from "react";
import isNil from "lodash.isnil";
import { toPrecision } from "next-common/utils";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import { useChainSettings } from "next-common/context/chain";
import PopupLabel from "../label";
import ConnectedSigner from "../../connectedSigner";
import ProxyInfo from "../proxyInfo";

export default function Signer({
  isBalanceLoading,
  balance,
  balanceName = "Balance",
  signerAccount,
  symbol,
}) {
  const node = useChainSettings();
  const noBalance = isNil(balance) && isNil(isBalanceLoading);

  return (
    <div>
      {noBalance ? (
        <PopupLabel text="Address" />
      ) : (
        <PopupLabelWithBalance
          text="Address"
          isLoading={isBalanceLoading}
          balanceName={balanceName}
          balance={toPrecision(balance ?? 0, node.decimals)}
          symbol={symbol || node.symbol}
        />
      )}
      <ConnectedSigner signerAccount={signerAccount} />
      {signerAccount?.proxyAddress && (
        <ProxyInfo address={signerAccount.proxyAddress} />
      )}
    </div>
  );
}
