import {
  MenuOverview,
  MenuDiscussions,
  MenuCalendar,
  MenuOffChainVoting,
  MenuDelegation,
} from "@osn/icons/subsquare";
import getChainSettings from "../settings";
import { CHAIN } from "next-common/utils/constants";
import { isKintsugiChain } from "next-common/utils/chain";

const chainSettings = getChainSettings(CHAIN);

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
  items: [
    {
      value: "overview",
      name: "Overview",
      pathname: "/",
      icon: <MenuOverview />,
    },
  ],
};

if (chainSettings.hasDiscussions !== false) {
  commonMenus.items.push(discussionsMenu);
}

if (
  (chainSettings.hasReferenda || !chainSettings.noDemocracy) &&
  !isKintsugiChain(CHAIN)
) {
  commonMenus.items.push({
    value: "delegation",
    name: "Delegation",
    pathname: "/delegation",
    icon: <MenuDelegation />,
  });
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
