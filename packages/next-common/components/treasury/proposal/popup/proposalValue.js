import React from "react";
import BalanceInput from "../../../balanceInput";
import { getNode } from "../../../../utils";
import Labeled from "../../../Labeled";

export default function ProposalValue({ chain, setValue }) {
  const node = getNode(chain);

  return (
    <Labeled
      text={"Value"}
      tooltip={"The amount that will be allocated from the treasury pot"}
    >
      <BalanceInput setValue={setValue} symbol={node?.symbol} />
    </Labeled>
  );
}
