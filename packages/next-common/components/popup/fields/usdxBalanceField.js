import React from "react";
import PopupLabel from "next-common/components/popup/label";
import SymbolSelectInput from "next-common/components/symbolSelectInput";

export default function USDxBalanceField({
  isLoading,
  inputBalance,
  setInputBalance,
  symbol,
  setSymbol,
  title = "Balance",
  status,
}) {
  return (
    <div>
      <PopupLabel text={title} status={status} />
      <SymbolSelectInput
        symbolOptions={["USDT", "USDC"]}
        disabled={isLoading}
        value={inputBalance}
        onValueChange={setInputBalance}
        symbol={symbol}
        onSymbolChange={setSymbol}
      />
    </div>
  );
}
