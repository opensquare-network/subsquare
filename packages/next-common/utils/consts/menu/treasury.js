import Chains from "../chains";
import { getExcludeChains } from "../../viewfuncs";
import React from "react";
import { MenuTreasury } from "@osn/icons/subsquare";

const treasury = {
  name: "TREASURY",
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
      name: "Proposals",
      pathname: "/treasury/proposals",
      extraMatchNavMenuActivePathnames: ["/treasury/proposals/[id]"],
    },
    {
      value: "bounties",
      name: "Bounties",
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
      name: "Child Bounties",
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
      name: "Tips",
      pathname: "/treasury/tips",
      extraMatchNavMenuActivePathnames: ["/treasury/tip/[id]"],
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
