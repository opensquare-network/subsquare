import React from "react";
import Labeled from "../../../Labeled";
import { useChainSettings } from "../../../../context/chain";
import CurrencyInput from "next-common/components/currencyInput";

export default function ProposalValue({ setValue }) {
  const { symbol } = useChainSettings();

  return (
    <Labeled
      text={"Value"}
      tooltip={"The amount that will be allocated from the treasury pot"}
    >
      <CurrencyInput onValueChange={setValue} symbol={symbol} />
    </Labeled>
  );
}
