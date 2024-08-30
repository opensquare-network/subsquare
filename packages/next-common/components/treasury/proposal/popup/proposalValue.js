import React from "react";
import BalanceInput from "../../../balanceInput";
import Labeled from "../../../Labeled";
import { useChainSettings } from "../../../../context/chain";

export default function ProposalValue({ setValue }) {
  const { symbol } = useChainSettings();

  return (
    <Labeled
      text={"Value"}
      tooltip={"The amount that will be allocated from the treasury pot"}
    >
      <BalanceInput setValue={setValue} symbol={symbol} />
    </Labeled>
  );
}
