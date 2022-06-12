import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";

const financialCouncil = {
  name: "FINANCIAL COUNCIL",
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
  excludeToChains: getExcludeChains([Chains.karura, Chains.acala]),
};

export default financialCouncil;
