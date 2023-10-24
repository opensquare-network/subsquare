import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import React from "react";
import { MenuFinancialCouncil } from "@osn/icons/subsquare";

export const Names = {
  financialCouncil: "FINANCIAL COUNCIL",
  financialMotions: "Motions",
  financialCouncilMembers: "Members",
};

const financialCouncil = {
  name: Names.financialCouncil,
  excludeToChains: getExcludeChains([Chains.karura, Chains.acala]),
  icon: <MenuFinancialCouncil />,
  pathname: "/financial-council",
  items: [
    {
      value: "financialMotions",
      name: Names.financialMotions,
      pathname: "/financial-council/motions",
      extraMatchNavMenuActivePathnames: ["/financial-council/motions/[id]"],
    },
    {
      value: "financialCouncilMembers",
      name: Names.financialCouncilMembers,
      pathname: "/financial-council/members",
    },
  ],
};

export default financialCouncil;
