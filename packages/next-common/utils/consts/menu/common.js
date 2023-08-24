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
  extraMatchNavMenuActivePathnames: ["/polkassembly/posts/[id]"],
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
      extraMatchNavMenuActivePathnames: ["/posts/[id]"],
      excludeToChains: [Chains.centrifuge, Chains.altair],
      icon: <MenuDiscussions />,
    },
  ],
};

if (
  [
    Chains.polkadot,
    Chains.kusama,
    Chains.moonriver,
    Chains.collectives,
  ].includes(process.env.NEXT_PUBLIC_CHAIN)
) {
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
    name: "Off-chain Voting",
    pathname: `https://voting.opensquare.io/space/${space}`,
    icon: <MenuOffChainVoting />,
  });
}

export default commonMenus;
