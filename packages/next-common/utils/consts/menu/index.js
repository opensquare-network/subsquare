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
import getChainSettings from "../settings";
import { getMoreMenu } from "./more";

export function getHomeMenu({
  summary = {},
  tracks = [],
  ambassadorTracks = [],
  currentTrackId,
} = {}) {
  if (isAssetHub()) {
    return assetHubMenu;
  }

  const { modules } = getChainSettings(CHAIN);

  return [
    commonMenus,
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
    modules?.preimages && preImages,
  ].filter(Boolean);
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

    // single menu
    if (!m?.items?.length) {
      featuredMenu.push(m);
      continue;
    }

    // root menu archived
    if (m?.archived) {
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

  const commonMenu = getCommonMenu({
    tracks,
    fellowshipTracks,
    ambassadorTracks,
  });
  const moreMenu = getMoreMenu({ archivedMenu });

  return [
    ...commonMenu,
    { type: "divider" },
    ...featuredMenu,
    { type: "divider" },
    moreMenu,
  ];
}
