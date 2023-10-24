import React from "react";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import { MenuAlliance } from "@osn/icons/subsquare";

export const Names = {
  alliance: "ALLIANCE",
  allianceMotions: "Motions",
  allianceMembers: "Members",
  allianceUnscrupulous: "Unscrupulous",
  allianceAnnouncements: "Announcements",
};

const motions = {
  value: "allianceMotions",
  name: Names.allianceMotions,
  pathname: "/alliance/motions",
  extraMatchNavMenuActivePathnames: ["/alliance/motions/[id]"],
};

const members = {
  value: "allianceMembers",
  name: Names.allianceMembers,
  pathname: "/alliance/members",
};

const unscrupulous = {
  value: "allianceUnscrupulous",
  name: Names.allianceUnscrupulous,
  pathname: "/alliance/unscrupulous",
};

const announcements = {
  value: "allianceAnnouncements",
  name: Names.allianceAnnouncements,
  pathname: "/alliance/announcements",
  extraMatchNavMenuActivePathnames: ["/alliance/announcements/[id]"],
};

const alliance = {
  name: Names.alliance,
  excludeToChains: getExcludeChains([
    Chains["westend-collectives"],
    Chains.collectives,
  ]),
  icon: <MenuAlliance />,
  pathname: "/alliance",
  items: [announcements, motions, unscrupulous, members],
};

export default alliance;
