import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import React from "react";
import { MenuAdvisoryCommittee } from "@osn/icons/subsquare";

const advisoryCommittee = {
  name: "ADVISORY COMMITTEE",
  excludeToChains: getExcludeChains([Chains.zeitgeist]),
  icon: <MenuAdvisoryCommittee />,
  pathname: "/advisory-committee",
  items: [
    {
      value: "advisoryMotions",
      name: "Motions",
      pathname: "/advisory-committee/motions",
      extraMatchNavMenuActivePathnames: ["/advisory-committee/motions/[id]"],
    },
    {
      value: "advisoryCouncilMembers",
      name: "Members",
      pathname: "/advisory-committee/members",
    },
  ],
};

export default advisoryCommittee;
