import React from "react";
import CurrencyInput from "../../currencyInput";
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
      <CurrencyInput
        placeholder="0.00"
        disabled={isLoading || disabled}
        value={inputBalance}
        onValueChange={(value) => {
          setInputBalance(value);
        }}
        symbol={symbol || node.symbol}
      />
    </div>
  );
}
