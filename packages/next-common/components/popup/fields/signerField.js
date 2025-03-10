import React from "react";
import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import { useChainSettings } from "next-common/context/chain";
import PopupLabel from "../label";
import MaybeProxySigner from "../../signer";

export default function Signer({
  title = "Origin",
  balanceName = "Balance",
  symbol,
  balance,
  isBalanceLoading,
  noSwitchSigner = false,
}) {
  const node = useChainSettings();
  const noBalance = isNil(balance) && isNil(isBalanceLoading);

  return (
    <div>
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
      <MaybeProxySigner noSwitch={noSwitchSigner} />
    </div>
  );
}
