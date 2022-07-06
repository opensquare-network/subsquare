import React from "react";
import BalanceInput from "../../../balanceInput";
import { getNode } from "utils";
import PopupLabel from "../../../popup/label";

export default function TipValue({ chain, setValue }) {
  const node = getNode(chain);

  return (
    <div>
      <PopupLabel
        text={"Value"}
        tooltip={"The amount of tip value"}
      />
      <BalanceInput setValue={setValue} symbol={node?.symbol} />
    </div>
  );
}
