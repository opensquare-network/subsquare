import Chains from "../chains";
import MotionIcon from "../../../assets/imgs/icons/type-motions.svg";
import React from "react";
import MembersIcon from "../../../assets/imgs/icons/members.svg";

const council = {
  name: "COUNCIL",
  excludeToChains: [Chains.kabocha, Chains.kintsugi, Chains.interlay],
  items: [
    {
      value: "motions",
      name: "Motions",
      pathname: "/council/motions",
      icon: <MotionIcon />,
    },
    {
      value: "councilMembers",
      name: "Members",
      pathname: "/council/members",
      icon: <MembersIcon />,
    },
  ],
};

export default council;
