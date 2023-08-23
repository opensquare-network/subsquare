import React from "react";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import { MenuAlliance } from "@osn/icons/subsquare";

const motions = {
  value: "allianceMotions",
  name: "Motions",
  pathname: "/alliance/motions",
  extraMatchNavMenuActivePathnames: ["/alliance/motions/[id]"],
};

const members = {
  value: "allianceMembers",
  name: "Members",
  pathname: "/alliance/members",
};

const unscrupulous = {
  value: "allianceUnscrupulous",
  name: "Unscrupulous",
  pathname: "/alliance/unscrupulous",
};

const announcements = {
  value: "allianceAnnouncements",
  name: "Announcements",
  pathname: "/alliance/announcements",
  extraMatchNavMenuActivePathnames: ["/alliance/announcement/[id]"],
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
