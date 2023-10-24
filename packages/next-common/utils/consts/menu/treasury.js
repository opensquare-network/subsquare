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

const treasury = {
  name: Names.treasury,
  excludeToChains: [
    Chains.kabocha,
    Chains["westend-collectives"],
    Chains.collectives,
  ],
  icon: <MenuTreasury />,
  pathname: "/treasury",
  items: [
    {
      value: "proposals",
      name: Names.proposals,
      pathname: "/treasury/proposals",
      extraMatchNavMenuActivePathnames: ["/treasury/proposals/[id]"],
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
      ],
    },
  ],
};

export default treasury;
