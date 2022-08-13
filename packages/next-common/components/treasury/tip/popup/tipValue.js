import React from "react";
import BalanceInput from "../../../balanceInput";
import { getNode } from "../../../../utils";
import Labeled from "../../../Labeled";

export default function TipValue({ chain, setValue }) {
  const node = getNode(chain);

  return (
    <Labeled text={"Value"} tooltip={"The amount of tip value"}>
      <BalanceInput setValue={setValue} symbol={node?.symbol} />
    </Labeled>
  );
}
