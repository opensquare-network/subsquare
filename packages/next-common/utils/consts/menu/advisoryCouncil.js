import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import React from "react";
import { MenuAdvisoryCommittee } from "@osn/icons/subsquare";

export const Names = {
  advisoryCommittee: "ADVISORY COMMITTEE",
  advisoryMotions: "Motions",
  advisoryCouncilMembers: "Members",
};

const advisoryCommittee = {
  name: Names.advisoryCommittee,
  excludeToChains: getExcludeChains([Chains.zeitgeist]),
  icon: <MenuAdvisoryCommittee />,
  pathname: "/advisory-committee",
  items: [
    {
      value: "advisoryMotions",
      name: Names.advisoryMotions,
      pathname: "/advisory-committee/motions",
      extraMatchNavMenuActivePathnames: ["/advisory-committee/motions/[id]"],
    },
    {
      value: "advisoryCouncilMembers",
      name: Names.advisoryCouncilMembers,
      pathname: "/advisory-committee/members",
    },
  ],
};

export default advisoryCommittee;
