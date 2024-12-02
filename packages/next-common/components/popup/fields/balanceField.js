import React from "react";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import { useChainSettings } from "../../../context/chain";

export default function BalanceField({
  isLoading,
  inputBalance,
  setInputBalance,
  symbol,
  title = "Balance",
  titleTooltip = "",
  disabled = false,
}) {
  const node = useChainSettings();
  return (
    <div>
      <PopupLabel text={title} tooltip={titleTooltip} />
      <Input
        type="text"
        placeholder="0.00"
        disabled={isLoading || disabled}
        value={inputBalance}
        onChange={(e) => setInputBalance(e.target.value.replace("。", "."))}
        symbol={symbol || node.symbol}
      />
    </div>
  );
}
