import React from "react";
import { TextBox } from "./styled";
import Labeled from "../../../Labeled";
import { useChainSettings } from "next-common/context/chain";

export default function ProposalBond({ bond }) {
  const { decimals } = useChainSettings();
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
