import Chains from "../chains";
import React from "react";
import { MenuCouncil } from "@osn/icons/subsquare";
import isMoonChain from "next-common/utils/isMoonChain";

export const Names = {
  council: "COUNCIL",
  motions: "Motions",
  councilMembers: "Members",
};

export function getCouncilMenu(summary) {
  let activeMotions = 0;
  if (isMoonChain()) {
    activeMotions = summary?.moonCouncilMotions?.active || 0;
  } else {
    activeMotions = summary?.motions?.active || 0;
  }

  return {
    name: Names.council,
    excludeToChains: [
      Chains.kabocha,
      Chains.kintsugi,
      Chains.interlay,
      Chains.development,
      Chains.westendCollectives,
      Chains.collectives,
      Chains.vara,
    ],
    archivedToChains: [Chains.kusama, Chains.polkadot, Chains.rococo],
    activeCount: activeMotions,
    icon: <MenuCouncil />,
    pathname: "/council",
    items: [
      {
        value: "motions",
        name: Names.motions,
        pathname: "/council/motions",
        extraMatchNavMenuActivePathnames: ["/council/motions/[id]"],
        activeCount: activeMotions,
      },
      {
        value: "councilMembers",
        name: Names.councilMembers,
        pathname: "/council/members",
      },
    ],
  };
}

const council = getCouncilMenu();

export default council;
