import Chains from "../chains";
import React from "react";
import { MenuTechComm } from "@osn/icons/subsquare";

export const Names = {
  techComm: "Technical Committee",
  techCommProposals: "Proposals",
  techCommMembers: "Members",
};

export function getTechCommMenu(summary) {
  const activeTechCommMotions = summary?.techCommMotions?.active || 0;

  return {
    name: Names.techComm,
    excludeToChains: [
      Chains.kabocha,
      Chains.centrifuge,
      Chains.altair,
      Chains.development,
      Chains.westendCollectives,
      Chains.collectives,
      Chains.vara,
      Chains.westend,
      Chains.zkverifyTestnet,
    ],
    archivedToChains: [Chains.kusama, Chains.polkadot, Chains.rococo],
    activeCount: activeTechCommMotions,
    icon: <MenuTechComm />,
    pathname: "/techcomm",
    items: [
      {
        value: "techCommProposals",
        name: Names.techCommProposals,
        pathname: "/techcomm/proposals",
        extraMatchNavMenuActivePathnames: ["/techcomm/proposals/[id]"],
        activeCount: activeTechCommMotions,
      },
      {
        value: "techCommMembers",
        name: Names.techCommMembers,
        pathname: "/techcomm/members",
      },
    ],
  };
}

const techComm = getTechCommMenu();

export default techComm;
