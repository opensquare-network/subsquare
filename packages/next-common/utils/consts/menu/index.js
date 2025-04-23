import commonMenus from "./common";
import { getDemocracyMenu } from "./democracy";
import { getTreasuryMenu } from "./treasury";
import { getCouncilMenu } from "./council";
import { getTechCommMenu } from "./tc";
import { getFinancialCouncilMenu } from "./financialCouncil";
import { getAdvisoryCommitteeMenu } from "./advisoryCouncil";
import { getAllianceMenu } from "./alliance";
import { getReferendaMenu } from "./referenda";
import { getFellowshipMenu } from "./fellowship";
import { getAmbassadorMenu } from "next-common/utils/consts/menu/ambassador";
import { assetHubMenu } from "./assetHub";
import { getCommunityCouncilMenu } from "./communityCouncil";
import { CHAIN } from "next-common/utils/constants";
import preImages from "./preImages";
import { partition } from "lodash-es";
import { getCommunityTreasuryMenu } from "./communityTreasury";
import getChainSettings from "../settings";
import { getMoreMenu } from "./more";
import { coretimeMenu } from "./coretime";
import Data from "./data";
import getAdvancedMenu from "next-common/utils/consts/menu/advanced";
import { NAV_MENU_TYPE } from "next-common/utils/constants";

export function getHomeMenu({
  summary = {},
  tracks = [],
  ambassadorTracks = [],
  currentTrackId,
} = {}) {
  const { modules, hasMultisig = false } = getChainSettings(CHAIN);

  const integrationsMenu = [
    modules?.assethub && assetHubMenu,
    modules?.coretime && coretimeMenu,
  ].filter(Boolean);

  return [
    modules?.referenda && getReferendaMenu(tracks, currentTrackId),
    modules?.fellowship && getFellowshipMenu(summary, currentTrackId),
    modules?.ambassador && getAmbassadorMenu(ambassadorTracks, currentTrackId),
    modules?.democracy && getDemocracyMenu(summary),
    modules?.treasury && getTreasuryMenu(summary),
    modules?.communityTreasury && getCommunityTreasuryMenu(summary),
    modules?.council && getCouncilMenu(summary),
    modules?.technicalCommittee && getTechCommMenu(summary),
    modules?.financialCouncil && getFinancialCouncilMenu(summary),
    modules?.advisoryCommittee && getAdvisoryCommitteeMenu(summary),
    modules?.alliance && getAllianceMenu(summary),
    modules?.communityCouncil && getCommunityCouncilMenu(summary),
    getAdvancedMenu(
      [modules?.preimages && preImages, ...integrationsMenu].filter(Boolean),
    ),
    (modules?.proxy || modules?.vesting || hasMultisig) && Data,
  ].filter(Boolean);
}

export function getMainMenu({
  summary = {},
  tracks = [],
  fellowshipTracks = [],
  ambassadorTracks = [],
  currentTrackId,
} = {}) {
  const modulesMenu = getHomeMenu({
    summary,
    tracks,
    fellowshipTracks,
    ambassadorTracks,
    currentTrackId,
  });

  const activeModulesMenu = [];
  const archivedModulesMenu = [];

  for (let idx = 0; idx < modulesMenu.length; idx++) {
    const m = modulesMenu[idx];

    // single menu
    if (!m?.items?.length) {
      activeModulesMenu.push(m);
      continue;
    }

    // root menu archived
    if (m?.archived) {
      archivedModulesMenu.push(m);
    }
    // child menu
    else {
      const [activeItems, archivedItems] = partition(
        m.items,
        (item) => !item?.archived,
      );

      if (archivedItems.length) {
        archivedModulesMenu.push({
          ...m,
          items: archivedItems,
        });
      }
      if (activeItems.length) {
        activeModulesMenu.push({
          ...m,
          items: activeItems,
        });
      }
    }
  }

  const moreMenu = getMoreMenu({ archivedMenu: archivedModulesMenu });

  return [
    ...commonMenus.items,
    { type: "divider" },
    ...activeModulesMenu,
    { type: "divider" },
    moreMenu,
  ];
}

const findedMenu = (menu, pathname) => {
  for (const menuItem of menu) {
    const matched = menuItem.pathname === pathname;
    if (menuItem?.items?.length) {
      const findItem = findedMenu(menuItem.items, pathname);
      if (findItem) {
        return menuItem;
      }
    }
    if (matched) {
      return menuItem;
    }
  }
};
const isSubSpaceNavMenu = (type) => type === NAV_MENU_TYPE.subspace;
export function matchNewMenu(menu, pathname) {
  for (const menuItem of menu) {
    if (isSubSpaceNavMenu(menuItem.type) || menuItem.type === "archived") {
      const findMenu = findedMenu(menuItem.items, pathname);
      if (findMenu) {
        return {
          type: menuItem.type,
          menu: menuItem.items,
        };
      }
    } else if (menuItem?.items?.length) {
      const metchMenu = matchNewMenu(menuItem.items, pathname);
      if (metchMenu) {
        return metchMenu;
      }
    }
  }
}
