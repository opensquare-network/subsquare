import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import MotionIcon from "../../../assets/imgs/icons/type-motions.svg";
import React from "react";
import MembersIcon from "../../../assets/imgs/icons/members.svg";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";

const financialCouncil = {
  name: "FINANCIAL COUNCIL",
  excludeToChains: getExcludeChains([Chains.karura, Chains.acala]),
  items: [
    {
      value: "financialMotions",
      name: "Motions",
      pathname: "/financial-council/motions",
      icon: (
        <MenuIconWrapper>
          <MotionIcon />
        </MenuIconWrapper>
      ),
    },
    {
      value: "financialCouncilMembers",
      name: "Members",
      pathname: "/financial-council/members",
      icon: (
        <MenuIconWrapper>
          <MembersIcon />
        </MenuIconWrapper>
      ),
    },
  ],
};

export default financialCouncil;
