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
import { getTreasuryCouncilMenu } from "./treasuryCouncil";
import { getOpenTechCommMenu } from "./openTechCommittee";
import { CHAIN } from "next-common/utils/constants";
import isMoonChain from "next-common/utils/isMoonChain";
import preImages from "./preImages";

export function getHomeMenu({
  summary = {},
  tracks = [],
  fellowshipTracks = [],
  currentTrackId,
} = {}) {
  if (isMoonChain()) {
    return [
      commonMenus,
      getReferendaMenu(tracks, currentTrackId),
      getDemocracyMenu(summary),
      getTreasuryMenu(summary),
      getCouncilMenu(summary),
      getTreasuryCouncilMenu(summary),
      getTechCommMenu(summary),
      getOpenTechCommMenu(summary),
      preImages,
    ];
  }

  return [
    commonMenus,
    getReferendaMenu(tracks, currentTrackId),
    getFellowshipMenu(fellowshipTracks, currentTrackId),
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

export function getCommonMenu({ tracks = [], fellowshipTracks = [] }) {
  const [commonMenu] = getHomeMenu({ tracks, fellowshipTracks });
  commonMenu.items = commonMenu.items.filter(
    (i) => !i?.excludeToChains?.includes?.(CHAIN),
  );
  return commonMenu.items;
}

export function getFeaturedMenu({
  summary = {},
  tracks = [],
  fellowshipTracks = [],
  currentTrackId,
}) {
  const menu = getHomeMenu({
    summary,
    tracks,
    fellowshipTracks,
    currentTrackId,
  });
  // drop common menu
  const featureMenuData = menu.slice(1);
  return featureMenuData
    .map((m) => {
      if (m?.archivedToChains?.includes?.(CHAIN)) {
        return null;
      }

      if (m?.excludeToChains?.includes?.(CHAIN)) {
        return null;
      }

      return {
        ...m,
        items: m.items?.filter?.((i) => !i?.excludeToChains?.includes?.(CHAIN)),
      };
    })
    .filter(Boolean);
}

export function getArchivedMenu({ tracks = [], fellowshipTracks = [] } = {}) {
  const menu = getHomeMenu({ tracks, fellowshipTracks });
  // drop common menu
  const archivedMenuData = menu.slice(1);
  return archivedMenuData
    .map((m) => {
      if (m?.excludeToChains?.includes?.(CHAIN)) {
        return null;
      }

      if (m?.archivedToChains?.includes?.(CHAIN)) {
        return m;
      }
    })
    .filter(Boolean);
}
