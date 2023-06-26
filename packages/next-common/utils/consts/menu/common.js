import React from "react";
import Chains from "../chains";
import {
  MenuOverview,
  MenuDiscussions,
  MenuPolkassembly,
  MenuCalendar,
  MenuOffChainVoting,
} from "@osn/icons/subsquare";

let polkassemblyMenu = {
  value: "polkassembly",
  name: "Polkassembly",
  pathname: "/polkassembly/discussions",
  icon: <MenuPolkassembly />,
};

const commonMenus = {
  items: [
    {
      value: "overview",
      name: "Overview",
      pathname: "/",
      icon: <MenuOverview />,
    },
    {
      value: "discussions",
      name: "Discussions",
      pathname: "/discussions",
      excludeToChains: [Chains.centrifuge, Chains.altair],
      icon: <MenuDiscussions />,
    },
  ],
};

if ([Chains.polkadot, Chains.kusama].includes(process.env.NEXT_PUBLIC_CHAIN)) {
  commonMenus.items.push(polkassemblyMenu);
}

commonMenus.items.push({
  value: "calendar",
  name: "Calendar",
  pathname: "/calendar",
  icon: <MenuCalendar />,
});

const space = process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE;
if (space) {
  commonMenus.items.push({
    value: "offChainVoting",
    name: "Off-chain",
    pathname: `https://voting.opensquare.io/space/${space}`,
    icon: <MenuOffChainVoting />,
  });
}

export default commonMenus;
