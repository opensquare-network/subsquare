import MotionIcon from "../../../assets/imgs/icons/type-motions.svg";
import React from "react";
import MembersIcon from "../../../assets/imgs/icons/members.svg";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";

const openTechCommittee = {
  name: "OPEN TECH.COMM.",
  items: [
    {
      value: "motions",
      name: "Motions",
      pathname: "/open-techcomm/proposals",
      icon: (
        <MenuIconWrapper>
          <MotionIcon />
        </MenuIconWrapper>
      ),
    },
    {
      value: "councilMembers",
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
