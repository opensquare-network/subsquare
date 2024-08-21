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
import { CHAIN } from "next-common/utils/constants";
import preImages from "./preImages";
import { partition } from "lodash-es";
import { getAmbassadorMenu } from "next-common/utils/consts/menu/ambassador";
import isAssetHub from "next-common/utils/isAssetHub";
import { assetHubMenu } from "./assetHub";

export function getHomeMenu({
  summary = {},
  tracks = [],
  fellowshipTracks = [],
  ambassadorTracks = [],
  currentTrackId,
} = {}) {
  if (isAssetHub()) {
    return assetHubMenu;
  }

  return [
    commonMenus,
    getReferendaMenu(tracks, currentTrackId),
    getFellowshipMenu(fellowshipTracks, currentTrackId),
    getAmbassadorMenu(ambassadorTracks, currentTrackId),
    getDemocracyMenu(summary),
    getTreasuryMenu(summary),
    getCouncilMenu(summary),
    getTechCommMenu(summary),
    getFinancialCouncilMenu(summary),
    getAdvisoryCommitteeMenu(summary),
    getAllianceMenu(summary),
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
        m.items?.filter?.((item) => !item?.excludeToChains?.includes?.(CHAIN)),
        (item) => !item?.archivedToChains?.includes?.(CHAIN),
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
