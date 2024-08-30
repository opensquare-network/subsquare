import React from "react";
import { TextBox } from "./styled";
import Labeled from "../../../Labeled";

export default function ProposalBond({ bond, decimals }) {
  const bondHuman = bond.div(Math.pow(10, decimals));

  return (
    <Labeled
      text={"Proposal bond"}
      tooltip={"The on-chain percentage for treasury"}
    >
      <TextBox>{bondHuman.toFixed()}</TextBox>
    </Labeled>
  );
}
