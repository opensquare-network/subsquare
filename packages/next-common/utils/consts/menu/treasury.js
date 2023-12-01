import React from "react";
import Chains from "../chains";
import { getExcludeChains } from "../../viewfuncs";
import { MenuTreasury } from "@osn/icons/subsquare";

export const Names = {
  treasury: "TREASURY",
  proposals: "Proposals",
  bounties: "Bounties",
  childBounties: "Child Bounties",
  tips: "Tips",
};

export function getTreasuryMenu(summary) {
  const activeTreasuryProposals = summary?.treasuryProposals?.active || 0;
  const activeBounties = summary?.bounties?.active || 0;
  const activeChildBounties = summary?.childBounties?.active || 0;
  const activeTips = summary?.tips?.active || 0;
  const totalActiveCount =
    activeTreasuryProposals + activeBounties + activeChildBounties + activeTips;

  return {
    name: Names.treasury,
    excludeToChains: [
      Chains.kabocha,
      Chains["westend-collectives"],
      Chains.collectives,
    ],
    icon: <MenuTreasury />,
    pathname: "/treasury",
    activeCount: totalActiveCount,
    items: [
      {
        value: "proposals",
        name: Names.proposals,
        pathname: "/treasury/proposals",
        extraMatchNavMenuActivePathnames: ["/treasury/proposals/[id]"],
        activeCount: activeTreasuryProposals,
      },
      {
        value: "bounties",
        name: Names.bounties,
        pathname: "/treasury/bounties",
        extraMatchNavMenuActivePathnames: ["/treasury/bounties/[id]"],
        excludeToChains: [
          Chains.basilisk,
          Chains.hydradx,
          Chains.hydradx,
          Chains.kintsugi,
          Chains.interlay,
          Chains.zeitgeist,
          Chains.centrifuge,
          Chains.altair,
          Chains.darwinia2,
          Chains.moonriver,
          Chains.moonbeam,
          Chains.vara,
        ],
        activeCount: activeBounties,
      },
      {
        value: "child-bounties",
        name: Names.childBounties,
        pathname: "/treasury/child-bounties",
        extraMatchNavMenuActivePathnames: ["/treasury/child-bounties/[id]"],
        excludeToChains: getExcludeChains([
          Chains.polkadot,
          Chains.kusama,
          Chains.rococo,
          Chains.khala,
          Chains.phala,
        ]),
        activeCount: activeChildBounties,
      },
      {
        value: "tips",
        name: Names.tips,
        pathname: "/treasury/tips",
        extraMatchNavMenuActivePathnames: ["/treasury/tips/[id]"],
        excludeToChains: [
          Chains.kintsugi,
          Chains.interlay,
          Chains.litmus,
          Chains.litentry,
          Chains.zeitgeist,
          Chains.centrifuge,
          Chains.altair,
          Chains.moonriver,
          Chains.moonbeam,
          Chains.vara,
          Chains.turing,
        ],
        activeCount: activeTips,
      },
    ],
  };
}

const treasury = getTreasuryMenu();

export default treasury;
