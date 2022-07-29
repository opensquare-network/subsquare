import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import MotionIcon from "../../../assets/imgs/icons/type-motions.svg";
import React from "react";
import MembersIcon from "../../../assets/imgs/icons/members.svg";

const financialCouncil = {
  name: "FINANCIAL COUNCIL",
  items: [
    {
      value: "financialMotions",
      name: "Motions",
      pathname: "/financial-council/motions",
      icon: <MotionIcon />,
    },
    {
      value: "financialCouncilMembers",
      name: "Members",
      pathname: "/financial-council/members",
      icon: <MembersIcon />,
    },
  ],
  excludeToChains: getExcludeChains([Chains.karura, Chains.acala]),
};

export default financialCouncil;
