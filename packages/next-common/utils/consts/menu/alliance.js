import React from "react";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";
import MotionIcon from "../../../assets/imgs/icons/type-motions.svg";
import AnnouncementIcon from "../../../assets/imgs/icons/type-announcements.svg";
import MembersIcon from "../../../assets/imgs/icons/members.svg";

const motions = {
  value: "allianceMotions",
  name: "Motions",
  pathname: "/alliance/motions",
  icon: (
    <MenuIconWrapper>
      <MotionIcon />
    </MenuIconWrapper>
  ),
};

const members = {
  value: "allianceMembers",
  name: "Members",
  pathname: "/alliance/members",
  icon: (
    <MenuIconWrapper>
      <MembersIcon />
    </MenuIconWrapper>
  ),
};

const announcements = {
  value: "allianceAnnouncements",
  name: "Announcements",
  pathname: "/alliance/announcements",
  icon: (
    <MenuIconWrapper>
      <AnnouncementIcon />
    </MenuIconWrapper>
  ),
};

const alliance = {
  name: "ALLIANCE",
  excludeToChains: getExcludeChains([
    Chains["westend-collectives"],
    Chains.collectives,
  ]),
  items: [announcements, motions, members],
};

export default alliance;
