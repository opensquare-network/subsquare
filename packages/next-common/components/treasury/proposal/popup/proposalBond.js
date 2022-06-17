import React from "react";
import PopupLabel from "../../../popup/label";
import { useEffect, useState } from "react";

import useApi from "../../../../utils/hooks/useSelectedEnpointApi";
import { TextBox } from "./styled";
import BigNumber from "bignumber.js";

export default function ProposalBond({ chain, inputValue, node, setBond }) {
  const [bondPercentage, setBondPercentage] = useState();
  const [bondMaximum, setBondMaximum] = useState();
  const [bondMinimum, setBondMinimum] = useState();

  const api = useApi(chain);

  const bnValue = new BigNumber(inputValue);

  let bond = bnValue
    .times(Math.pow(10, node.decimals))
    .times(bondPercentage / 1000000);

  if (bondMaximum) {
    bond = BigNumber.min(bond, bondMaximum);
  }

  if (bondMinimum) {
    bond = bond.isNaN()
      ? new BigNumber(bondMinimum)
      : BigNumber.max(bond, bondMinimum);
  }

  useEffect(() => {
    setBond(bond.toFixed());
  }, [bond.toFixed()]);

  useEffect(() => {
    if (api) {
      setBondPercentage(api.consts.treasury.proposalBond.toJSON());
      setBondMaximum(api.consts.treasury.proposalBondMaximum.toJSON());
      setBondMinimum(api.consts.treasury.proposalBondMinimum.toJSON());
    }
  }, [api]);

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
