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
  useCommaFormat = false,
}) {
  const node = useChainSettings();

  const handleChange = (e) => {
    const value = e.target.value.replace(/,/g, "");

    if (!useCommaFormat) {
      setInputBalance(value);
      return;
    }

    if (/^\d*\.?\d*$/.test(value)) {
      setInputBalance(value);
    }
  };

  const getDisplayValue = () => {
    if (!useCommaFormat || !inputBalance) {
      return inputBalance;
    }

    const [intPart, decimalPart] = inputBalance.split(".");
    const formattedIntPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return decimalPart !== undefined
      ? `${formattedIntPart}.${decimalPart}`
      : formattedIntPart;
  };

  return (
    <div>
      <PopupLabel text={title} tooltip={titleTooltip} />
      <Input
        type="text"
        placeholder="0.00"
        disabled={isLoading || disabled}
        value={getDisplayValue()}
        onChange={handleChange}
        symbol={symbol || node.symbol}
      />
    </div>
  );
}
