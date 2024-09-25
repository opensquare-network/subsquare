import {
  MenuOverview,
  MenuDiscussions,
  MenuDelegation,
  MenuAccount,
} from "@osn/icons/subsquare";
import getChainSettings from "../settings";
import { CHAIN } from "next-common/utils/constants";
import { isKintsugiChain } from "next-common/utils/chain";

const chainSettings = getChainSettings(CHAIN);

export const overviewMenu = {
  value: "overview",
  name: "Overview",
  pathname: "/",
  icon: <MenuOverview />,
};

const accountMenu = {
  value: "account",
  name: "Account",
  pathname: "/account/votes",
  extraMatchNavMenuActivePathnames: [
    "/account/been-delegated",
    "/account/delegations",
    "/account/deposits",
    "/account/multisigs",
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

const {
  modules: { referenda: hasReferenda, democracy },
} = chainSettings;
const hasDemocracy = democracy && !democracy?.archived;

if ((hasReferenda || hasDemocracy) && !isKintsugiChain(CHAIN)) {
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
