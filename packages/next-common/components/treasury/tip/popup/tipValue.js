import React from "react";
import BalanceInput from "../../../balanceInput";
import Labeled from "../../../Labeled";
import { useChainSettings } from "../../../../context/chain";

export default function TipValue({ setValue }) {
  const { symbol } = useChainSettings();

  return (
    <Labeled text={"Value"} tooltip={"The amount of tip value"}>
      <BalanceInput setValue={setValue} symbol={symbol} />
    </Labeled>
  );
}
