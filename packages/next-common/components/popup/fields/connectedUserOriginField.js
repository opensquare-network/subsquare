import React from "react";
import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import { useChainSettings } from "next-common/context/chain";
import PopupLabel from "../label";
import { ConnectedAccountSigner } from "../../signer";
// import ExtensionUpdatePrompt from "next-common/components/overview/accountInfo/components/extensionUpdatePrompt";

export default function ConnectedUserOrigin({
  title = "Origin",
  balanceName = "Balance",
  symbol,
  balance,
  isBalanceLoading,
}) {
  const node = useChainSettings();
  const noBalance = isNil(balance) && isNil(isBalanceLoading);

  return (
    <div>
      {/* <ExtensionUpdatePrompt isWithCache={false} /> */}

      {noBalance ? (
        <PopupLabel text={title || "Origin"} />
      ) : (
        <PopupLabelWithBalance
          text={title || "Origin"}
          isLoading={isBalanceLoading}
          balanceName={balanceName}
          balance={toPrecision(balance ?? 0, node.decimals)}
          symbol={symbol || node.symbol}
        />
      )}
      <ConnectedAccountSigner />
    </div>
  );
}
