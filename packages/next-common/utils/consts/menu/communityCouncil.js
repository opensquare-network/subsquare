import React from "react";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import { MenuCouncil } from "@osn/icons/subsquare";

export const Names = {
  communityCouncil: "COMMUNITY COUNCIL",
  communityMotions: "Motions",
  communityCouncilMembers: "Members",
};

export function getCommunityCouncilMenu(summary) {
  const activeCommunityMotions = summary?.communityMotions?.active || 0;

  return {
    name: Names.communityCouncil,
    excludeToChains: getExcludeChains([Chains.shibuya]),
    activeCount: activeCommunityMotions,
    icon: <MenuCouncil />,
    pathname: "/community-council",
    items: [
      {
        value: "communityMotions",
        name: Names.communityMotions,
        pathname: "/community-council/motions",
        extraMatchNavMenuActivePathnames: ["/community-council/motions/[id]"],
        activeCount: activeCommunityMotions,
      },
      {
        value: "communityCouncilMembers",
        name: Names.communityCouncilMembers,
        pathname: "/community-council/members",
      },
    ],
  };
}

const communityCouncil = getCommunityCouncilMenu();

export default communityCouncil;
