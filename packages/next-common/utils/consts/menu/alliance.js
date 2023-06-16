import React from "react";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";
import MotionIcon from "../../../assets/imgs/icons/type-motions.svg";
import AnnouncementIcon from "../../../assets/imgs/icons/type-announcements.svg";
import MembersIcon from "../../../assets/imgs/icons/members.svg";
import GhostIcon from "../../../assets/imgs/icons/ghost.svg";
import { MenuAlliance } from "@osn/icons/subsquare";

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

const unscrupulous = {
  value: "allianceUnscrupulous",
  name: "Unscrupulous",
  pathname: "/alliance/unscrupulous",
  icon: (
    <MenuIconWrapper>
      <GhostIcon />
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
  icon: <MenuAlliance />,
  pathname: "/alliance",
  items: [announcements, motions, unscrupulous, members],
};

export default alliance;
