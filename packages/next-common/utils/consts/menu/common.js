import React from "react";
import Chains from "../chains";
import OverviewIcon from "../../../assets/imgs/icons/overview.svg";
import CalendarIcon from "../../../assets/imgs/icons/calendar.svg";
import DiscussionIcon from "../../../assets/imgs/icons/discussions.svg";
import PolkassemblyIcon from "../../../assets/imgs/icons/polkassembly.svg";
import ReferendaIcon from "../../../assets/imgs/icons/type-referenda.svg";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";
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
  icon: (
    <MenuIconWrapper>
      <PolkassemblyIcon />
    </MenuIconWrapper>
  ),
  iconV2: <MenuPolkassembly />,
};

const commonMenus = {
  items: [
    {
      value: "overview",
      name: "Overview",
      pathname: "/",
      icon: (
        <MenuIconWrapper>
          <OverviewIcon />
        </MenuIconWrapper>
      ),
      iconV2: <MenuOverview />,
    },
    {
      value: "discussions",
      name: "Discussions",
      pathname: "/discussions",
      excludeToChains: [Chains.centrifuge, Chains.altair],
      icon: (
        <MenuIconWrapper>
          <DiscussionIcon />
        </MenuIconWrapper>
      ),
      iconV2: <MenuDiscussions />,
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
  icon: (
    <MenuIconWrapper>
      <CalendarIcon />
    </MenuIconWrapper>
  ),
  iconV2: <MenuCalendar />,
});

const space = process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE;
if (space) {
  commonMenus.items.push({
    value: "offChainVoting",
    name: "Off-chain",
    pathname: `https://voting.opensquare.io/space/${space}`,
    icon: (
      <MenuIconWrapper>
        <ReferendaIcon />
      </MenuIconWrapper>
    ),
    iconV2: <MenuOffChainVoting />,
  });
}

export default commonMenus;
