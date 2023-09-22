import React from "react";
import isNil from "lodash.isnil";
import { toPrecision } from "next-common/utils";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import { useChainSettings } from "next-common/context/chain";
import PopupLabel from "../label";
import ConnectedSigner from "../../connectedSigner";
import ProxyInfo from "../proxyInfo";
import ChangeableConnectedSigner from "next-common/components/changeableConnectedSigner";

export default function Signer({
  isBalanceLoading,
  balance,
  balanceName = "Balance",
  signerAccount,
  symbol,
  signerBalance,
  isSignerBalanceLoading,
}) {
  const node = useChainSettings();
  const noSignerBalance = isNil(signerBalance) && isNil(isSignerBalanceLoading);
  const noVotingBalance = isNil(balance) && isNil(isBalanceLoading);

  let signerDisplay = null;

  if (!signerAccount || signerAccount?.isLoggedInAddress) {
    signerDisplay = (
      <>
        <ConnectedSigner signerAccount={signerAccount} />
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
      </>
    );
  } else {
    signerDisplay = <ChangeableConnectedSigner signerAccount={signerAccount} />;
  }

  return (
    <div>
      {noSignerBalance ? (
        <PopupLabel text="Signer Address" />
      ) : (
        <PopupLabelWithBalance
          text="Address"
          isLoading={isSignerBalanceLoading}
          balanceName={balanceName}
          balance={toPrecision(signerBalance ?? 0, node.decimals)}
          symbol={symbol || node.symbol}
        />
      )}
      {signerDisplay}
    </div>
  );
}
