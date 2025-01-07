import React from "react";
import Labeled from "../../../Labeled";
import { useChainSettings } from "../../../../context/chain";
import CurrencyInput from "next-common/components/currencyInput";

export default function TipValue({ setValue }) {
  const { symbol } = useChainSettings();

  return (
    <Labeled text={"Value"} tooltip={"The amount of tip value"}>
      <CurrencyInput onValueChange={setValue} symbol={symbol} />
    </Labeled>
  );
}
