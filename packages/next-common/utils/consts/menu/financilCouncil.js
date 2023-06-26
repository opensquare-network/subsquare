import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import React from "react";
import { MenuFinancialCouncil } from "@osn/icons/subsquare";

const financialCouncil = {
  name: "FINANCIAL COUNCIL",
  excludeToChains: getExcludeChains([Chains.karura, Chains.acala]),
  icon: <MenuFinancialCouncil />,
  pathname: "/financial-council",
  items: [
    {
      value: "financialMotions",
      name: "Motions",
      pathname: "/financial-council/motions",
    },
    {
      value: "financialCouncilMembers",
      name: "Members",
      pathname: "/financial-council/members",
    },
  ],
};

export default financialCouncil;
