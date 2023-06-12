import MotionIcon from "../../../assets/imgs/icons/type-motions.svg";
import React from "react";
import MembersIcon from "../../../assets/imgs/icons/members.svg";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";

const openTechCommittee = {
  name: "OPEN TECH.COMM.",
  items: [
    {
      value: "openTechCommitteeProposals",
      name: "Proposals",
      pathname: "/open-techcomm/proposals",
      icon: (
        <MenuIconWrapper>
          <MotionIcon />
        </MenuIconWrapper>
      ),
    },
    {
      value: "openTechCommitteeMembers",
      name: "Members",
      pathname: "/open-techcomm/members",
      icon: (
        <MenuIconWrapper>
          <MembersIcon />
        </MenuIconWrapper>
      ),
    },
  ],
};

export default openTechCommittee;
