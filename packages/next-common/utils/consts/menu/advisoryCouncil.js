import React from "react";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import { MenuAdvisoryCommittee } from "@osn/icons/subsquare";

export const Names = {
  advisoryCommittee: "ADVISORY COMMITTEE",
  advisoryMotions: "Motions",
  advisoryCouncilMembers: "Members",
};

export function getAdvisoryCommitteeMenu(summary) {
  const activeAdvisoryMotions = summary?.advisoryMotions?.active || 0;

  return {
    name: Names.advisoryCommittee,
    excludeToChains: getExcludeChains([Chains.zeitgeist]),
    activeCount: activeAdvisoryMotions,
    icon: <MenuAdvisoryCommittee />,
    pathname: "/advisory-committee",
    items: [
      {
        value: "advisoryMotions",
        name: Names.advisoryMotions,
        pathname: "/advisory-committee/motions",
        extraMatchNavMenuActivePathnames: ["/advisory-committee/motions/[id]"],
        activeCount: activeAdvisoryMotions,
      },
      {
        value: "advisoryCouncilMembers",
        name: Names.advisoryCouncilMembers,
        pathname: "/advisory-committee/members",
      },
    ],
  };
}

const advisoryCommittee = getAdvisoryCommitteeMenu();

export default advisoryCommittee;
