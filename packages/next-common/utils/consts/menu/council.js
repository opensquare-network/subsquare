import Chains from "../chains";
import MotionIcon from "../../../assets/imgs/icons/type-motions.svg";
import React from "react";
import MembersIcon from "../../../assets/imgs/icons/members.svg";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";
import { MenuCouncil } from "@osn/icons/subsquare";

const council = {
  name: "COUNCIL",
  excludeToChains: [
    Chains.kabocha,
    Chains.kintsugi,
    Chains.interlay,
    Chains.development,
    Chains["westend-collectives"],
    Chains.collectives,
  ],
  icon: <MenuCouncil />,
  pathname: "/council",
  items: [
    {
      value: "motions",
      name: "Motions",
      pathname: "/council/motions",
      icon: (
        <MenuIconWrapper>
          <MotionIcon />
        </MenuIconWrapper>
      ),
    },
    {
      value: "councilMembers",
      name: "Members",
      pathname: "/council/members",
      icon: (
        <MenuIconWrapper>
          <MembersIcon />
        </MenuIconWrapper>
      ),
    },
  ],
};

export default council;
