import React from "react";
import PopupLabel from "next-common/components/popup/label";
import SymbolSelectInput from "next-common/components/symbolSelectInput";
import { useChainSettings } from "next-common/context/chain";

export default function MultiSymbolBalanceField({
  isLoading,
  inputBalance,
  setInputBalance,
  symbol,
  setSymbol,
  title = "Balance",
  status,
}) {
  const { symbol: chainSymbol } = useChainSettings();
  return (
    <div>
      <PopupLabel text={title} status={status} />
      <SymbolSelectInput
        symbolOptions={[chainSymbol, "USDT", "USDC"]}
        disabled={isLoading}
        value={inputBalance}
        onValueChange={setInputBalance}
        symbol={symbol}
        onSymbolChange={setSymbol}
      />
    </div>
  );
}
