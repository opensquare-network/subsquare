import React from "react";
import PopupLabel from "../../../popup/label";
import { TextBox } from "./styled";

export default function ProposalBond({ bond, node }) {
  const bondHuman = bond.div(Math.pow(10, node.decimals));

  return (
    <div>
      <PopupLabel
        text={"Proposal bond"}
        tooltip={"The on-chain percentage for treasury"}
      />
      <TextBox>{bondHuman.toFixed()}</TextBox>
    </div>
  );
}
