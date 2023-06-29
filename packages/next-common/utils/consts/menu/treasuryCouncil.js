import MotionIcon from "../../../assets/imgs/icons/type-motions.svg";
import React from "react";
import MembersIcon from "../../../assets/imgs/icons/members.svg";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";

const treasuryCouncil = {
  name: "TREASURY COUNCIL",
  items: [
    {
      value: "motions",
      name: "Motions",
      pathname: "/treasury-council/motions",
      icon: (
        <MenuIconWrapper>
          <MotionIcon />
        </MenuIconWrapper>
      ),
    },
    {
      value: "councilMembers",
      name: "Members",
      pathname: "/treasury-council/members",
      icon: (
        <MenuIconWrapper>
          <MembersIcon />
        </MenuIconWrapper>
      ),
    },
  ],

};

export default treasuryCouncil;
