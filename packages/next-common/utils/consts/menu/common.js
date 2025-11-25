import {
  MenuOverview,
  MenuDiscussions,
  MenuDelegation,
  MenuAccount,
  MenuCalendar,
  MenuOffChainVoting,
} from "@osn/icons/subsquare";
import getChainSettings from "../settings";
import { CHAIN } from "next-common/utils/constants";
import { getAccountUrl } from "next-common/hooks/account/useAccountUrl";
import supportsDelegation from "./supportsDelegation";
import { votingSpace, votingHost } from "next-common/utils/opensquareVoting";
import { NavigationItem, NavigationItemIcon } from "./navigationItem";

const chainSettings = getChainSettings(CHAIN);

export const overviewMenu = {
  value: "overview",
  name: "Overview",
  pathname: "/",
  icon: <MenuOverview />,
};

export const accountMenu = {
  value: "account",
  name: "Account",
  pathname: getAccountUrl(),
  extraMatchNavMenuActivePathnames: [
    "/account/been-delegated",
    "/account/delegations",
    "/account/deposits",
    "/account/multisigs",
    "/account/proxies",
  ],
  icon: <MenuAccount />,
};

export const discussionsMenu = {
  value: "discussions",
  name: "Discussions",
  pathname: "/discussions",
  extraMatchNavMenuActivePathnames: [
    "/posts/[id]",
    "/polkassembly/discussions",
    "/polkassembly/posts/[id]",
  ],
  icon: <MenuDiscussions />,
};

const calendarMenu = {
  value: "calendar",
  name: "Calendar",
  pathname: "/calendar",
  icon: <MenuCalendar />,
};
const votingMenu = {
  value: "offChainVoting",
  name: "Off-chain Voting",
  pathname: `${votingHost}/space/${votingSpace}`,
  icon: <MenuOffChainVoting />,
};

const navigationMenu = {
  value: "navigation",
  name: <NavigationItem />,
  icon: <NavigationItemIcon />,
};

const commonMenus = {
  items: [overviewMenu, calendarMenu, accountMenu],
};

if (chainSettings.modules.discussions) {
  commonMenus.items.push(discussionsMenu);
}

if (supportsDelegation()) {
  commonMenus.items.push({
    value: "delegation",
    name: "Delegation",
    pathname: "/delegation",
    extraMatchNavMenuActivePathnames: [
      "/delegation/statistics",
      "/delegation/mine",
      "/delegation/mine/received",
      "/delegation/mine/delegations",
    ],
    icon: <MenuDelegation />,
  });
}

if (votingSpace) {
  commonMenus.items.push(votingMenu);
}
commonMenus.items.push(navigationMenu);

export default commonMenus;
