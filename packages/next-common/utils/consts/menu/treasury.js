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
    },
    {
      value: "bounties",
      name: "Bounties",
      pathname: "/treasury/bounties",
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
      ],
    },
    {
      value: "child-bounties",
      name: "Child Bounties",
      pathname: "/treasury/child-bounties",
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
      excludeToChains: [
        Chains.kintsugi,
        Chains.interlay,
        Chains.litmus,
        Chains.litentry,
        Chains.zeitgeist,
        Chains.centrifuge,
        Chains.altair,
      ],
    },
  ],
};

export default treasury;
