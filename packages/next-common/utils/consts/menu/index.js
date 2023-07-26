import commonMenus from "./common";
import democracy from "./democracy";
import treasury from "./treasury";
import council from "./council";
import techComm from "./tc";
import financialCouncil from "./financilCouncil";
import advisoryCommittee from "./advisoryCouncil";
import alliance from "./alliance";
import { getReferendaMenu } from "./referenda";
import { getFellowshipMenu } from "./fellowship";
import isMoonChain from "next-common/utils/isMoonChain";
import treasuryCouncil from "./treasuryCouncil";
import openTechCommittee from "./openTechCommittee";
import { CHAIN } from "next-common/utils/constants";
import preImages from "./preImages";

export function getHomeMenu({
  tracks = [],
  fellowshipTracks = [],
  currentTrackId,
} = {}) {
  if (isMoonChain()) {
    return [
      commonMenus,
      getReferendaMenu(tracks, currentTrackId),
      democracy,
      treasury,
      council,
      treasuryCouncil,
      techComm,
      openTechCommittee,
      preImages,
    ];
  }

  return [
    commonMenus,
    getReferendaMenu(tracks, currentTrackId),
    getFellowshipMenu(fellowshipTracks, currentTrackId),
    democracy,
    treasury,
    council,
    techComm,
    financialCouncil,
    advisoryCommittee,
    alliance,
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
  tracks = [],
  fellowshipTracks = [],
  currentTrackId,
}) {
  const menu = getHomeMenu({ tracks, fellowshipTracks, currentTrackId });
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
