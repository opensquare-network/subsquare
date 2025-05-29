import {
  MenuOverview,
  MenuDiscussions,
  MenuDelegation,
  MenuAccount,
} from "@osn/icons/subsquare";
import getChainSettings from "../settings";
import { CHAIN } from "next-common/utils/constants";
import { getAccountUrl } from "next-common/hooks/account/useAccountUrl";
import supportsDelegation from "./supportsDelegation";

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

const commonMenus = {
  items: [overviewMenu, accountMenu],
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

export default commonMenus;
