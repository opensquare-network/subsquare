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
import isAssetHub from "next-common/utils/isAssetHub";
import { getCommunityTreasuryMenu } from "./communityTreasury";

export function getHomeMenu({
  summary = {},
  tracks = [],
  ambassadorTracks = [],
  currentTrackId,
} = {}) {
  if (isAssetHub()) {
    return assetHubMenu;
  }

  return [
    commonMenus,
    getReferendaMenu(tracks, currentTrackId),
    getFellowshipMenu(summary, currentTrackId),
    getAmbassadorMenu(ambassadorTracks, currentTrackId),
    getDemocracyMenu(summary),
    getTreasuryMenu(summary),
    getCommunityTreasuryMenu(summary),
    getCouncilMenu(summary),
    getTechCommMenu(summary),
    getFinancialCouncilMenu(summary),
    getAdvisoryCommitteeMenu(summary),
    getAllianceMenu(summary),
    getCommunityCouncilMenu(summary),
    preImages,
  ];
}

export function getCommonMenu({
  tracks = [],
  fellowshipTracks = [],
  ambassadorTracks = [],
}) {
  const [commonMenu] = getHomeMenu({
    tracks,
    fellowshipTracks,
    ambassadorTracks,
  });
  commonMenu.items = commonMenu.items.filter(
    (i) => !i?.excludeToChains?.includes?.(CHAIN),
  );
  return commonMenu.items;
}

export function getNavMenu({
  summary = {},
  tracks = [],
  fellowshipTracks = [],
  ambassadorTracks = [],
  currentTrackId,
} = {}) {
  const menu = getHomeMenu({
    summary,
    tracks,
    fellowshipTracks,
    ambassadorTracks,
    currentTrackId,
  });

  const featuredMenu = [];
  const archivedMenu = [];

  for (let idx = 0; idx < menu.slice(1).length; idx++) {
    const m = menu.slice(1)[idx];

    // next loop early
    if (m?.excludeToChains?.includes?.(CHAIN)) {
      continue;
    }

    // single menu
    if (!m?.items?.length) {
      featuredMenu.push(m);
      continue;
    }

    // root menu archived
    if (m?.archivedToChains?.includes?.(CHAIN)) {
      archivedMenu.push(m);
    }
    // child menu
    else {
      const [featuredItems, archivedItems] = partition(
        m.items,
        (item) => !item?.archived,
      );

      if (archivedItems.length) {
        archivedMenu.push({
          ...m,
          items: archivedItems,
        });
      }
      if (featuredItems.length) {
        featuredMenu.push({
          ...m,
          items: featuredItems,
        });
      }
    }
  }

  return { featuredMenu, archivedMenu };
}
