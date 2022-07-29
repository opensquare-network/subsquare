import React from "react";
import Chains from "../chains";
import OverviewIcon from "../../../assets/imgs/icons/overview.svg";
import DiscussionIcon from "../../../assets/imgs/icons/discussions.svg";
import PolkassemblyIcon from "../../../assets/imgs/icons/polkassembly.svg";
import ReferendaIcon from "../../../assets/imgs/icons/type-referenda.svg";

let polkassemblyMenu = {
  value: "polkassembly",
  name: "Polkassembly",
  pathname: "/polkassembly/discussions",
  icon: <PolkassemblyIcon />,
};

const commonMenus = {
  items: [
    {
      value: "overview",
      name: "Overview",
      pathname: "/",
      icon: <OverviewIcon />,
    },
    {
      value: "discussions",
      name: "Discussions",
      pathname: "/discussions",
      icon: <DiscussionIcon />,
    },
  ],
};

if ([Chains.polkadot, Chains.kusama].includes(process.env.NEXT_PUBLIC_CHAIN)) {
  commonMenus.items.push(polkassemblyMenu);
}

const space = process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE;
if (space) {
  commonMenus.items.push({
    value: "offChainVoting",
    name: "Off-chain",
    pathname: `https://voting.opensquare.io/space/${space}`,
    icon: <ReferendaIcon />,
  });
}

export default commonMenus;
