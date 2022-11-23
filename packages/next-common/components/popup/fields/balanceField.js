import React from "react";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";

export default function BalanceField({
  isLoading,
  inputBalance,
  setInputBalance,
  symbol,
  title = "Balance",
  titleTooltip = "",
}) {
  return (
    <div>
      <PopupLabel text={title} tooltip={titleTooltip} />
      <Input
        type="text"
        placeholder="0"
        disabled={isLoading}
        value={inputBalance}
        onChange={(e) => setInputBalance(e.target.value.replace("。", "."))}
        symbol={symbol}
      />
    </div>
  );
}
