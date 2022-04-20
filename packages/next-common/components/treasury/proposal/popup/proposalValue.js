import React from "react";
import BalanceInput from "../../../balanceInput";
import { getNode } from "utils";
import PopupLabel from "../../../popup/label";

export default function ProposalValue({ chain, setValue }) {
  const node = getNode(chain);

  return (
    <div>
      <PopupLabel
        text={"Value"}
        tooltip={"The amount that will be allocated from the treasury pot"}
      />
      <BalanceInput setValue={setValue} symbol={node?.symbol} />
    </div>
  );
}
