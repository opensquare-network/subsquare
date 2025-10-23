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
import { peopleMenu } from "./people";
import whitelist from "./whitelist";
import Data from "./data";
import getAdvancedMenu from "next-common/utils/consts/menu/advanced";
import { NAV_MENU_TYPE } from "next-common/utils/constants";
import { isArray } from "lodash-es";
import { assetsMenu } from "./assets";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";

export function getHomeMenu({
  summary = {},
  tracks = [],
  ambassadorTracks = [],
  currentTrackId,
} = {}) {
  const {
    modules,
    hasMultisig = false,
    hotMenu = {},
  } = getChainSettings(CHAIN);

  const integrationsMenu = [
    isAssetHubMigrated() ? assetsMenu : assetHubMenu,
    modules?.coretime && coretimeMenu,
    modules?.people && peopleMenu,
  ].filter(Boolean);

  const menuItems = [
    modules?.referenda &&
      getReferendaMenu(tracks, currentTrackId, hotMenu.referenda),
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
      [
        modules?.preimages && preImages,
        modules?.whitelist && whitelist,
        ...integrationsMenu,
        (modules?.proxy || modules?.vesting || hasMultisig) && Data,
      ].filter(Boolean),
    ),
  ].filter(Boolean);

  return menuItems.map((menuItem) => {
    if (menuItem.hideItemsOnMenu === true && menuItem.items) {
      return {
        ...menuItem,
        items: [],
      };
    }
    return menuItem;
  });
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

const matchedMenuItem = (menu, pathname) => {
  for (const menuItem of menu) {
    const matched =
      menuItem.pathname === pathname ||
      menuItem?.extraMatchNavMenuActivePathnames?.includes?.(pathname);
    if (menuItem?.items?.length) {
      const findItem = matchedMenuItem(menuItem.items, pathname);
      if (findItem) {
        return menuItem;
      }
    }
    if (matched) {
      return menuItem;
    }
  }
};

function matchedGroupMenu(menu, pathname) {
  return isNavGroupMenu(menu.type) && menu?.pathname === pathname;
}

const isSubSpaceNavMenu = (type) =>
  type === NAV_MENU_TYPE.subspace || type === "archived";

const isNavGroupMenu = (type) => type === NAV_MENU_TYPE.group;

export function matchNewMenu(menu, pathname) {
  if (!isArray(menu)) {
    return null;
  }
  for (const menuItem of menu) {
    if (matchedGroupMenu(menuItem, pathname)) {
      return null;
    } else if (isSubSpaceNavMenu(menuItem.type)) {
      const findMenu = matchedMenuItem(menuItem.items, pathname);
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
  return null;
}
