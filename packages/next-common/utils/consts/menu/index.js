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
import { assetHubMenu, assetsHubMenu } from "./assetHub";
import { getCommunityCouncilMenu } from "./communityCouncil";
import { CHAIN } from "next-common/utils/constants";
import preImages from "./preImages";
import { partition } from "lodash-es";
import isAssetHub from "next-common/utils/isAssetHub";
import { getCommunityTreasuryMenu } from "./communityTreasury";
import getChainSettings from "../settings";
import { getMoreMenu } from "./more";
import { coretimeMenu } from "./coretime";

export function getHomeMenu({
  summary = {},
  tracks = [],
  ambassadorTracks = [],
  currentTrackId,
} = {}) {
  const { modules } = getChainSettings(CHAIN);

  const integrationsMenu = [
    modules?.coretime && coretimeMenu,
    modules?.assethub && assetsHubMenu,
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
    modules?.preimages && preImages,
    ...(integrationsMenu ? [{ type: "divider" }, ...integrationsMenu] : []),
  ].filter(Boolean);
}

export function getMainMenu({
  summary = {},
  tracks = [],
  fellowshipTracks = [],
  ambassadorTracks = [],
  currentTrackId,
} = {}) {
  if (isAssetHub()) {
    return [...assetHubMenu];
  }

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
