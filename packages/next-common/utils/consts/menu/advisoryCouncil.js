import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import MotionIcon from "../../../assets/imgs/icons/type-motions.svg";
import React from "react";
import MembersIcon from "../../../assets/imgs/icons/members.svg";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";

const advisoryCouncil = {
  name: "ADVISORY COUNCIL",
  items: [
    {
      value: "advisoryMotions",
      name: "Motions",
      pathname: "/advisory-committee/motions",
      icon: (
        <MenuIconWrapper>
          <MotionIcon />
        </MenuIconWrapper>
      ),
    },
    {
      value: "advisoryCouncilMembers",
      name: "Members",
      pathname: "/advisory-committee/members",
      icon: (
        <MenuIconWrapper>
          <MembersIcon />
        </MenuIconWrapper>
      ),
    },
  ],
  excludeToChains: getExcludeChains([Chains.zeitgeist]),
};

export default advisoryCouncil;
