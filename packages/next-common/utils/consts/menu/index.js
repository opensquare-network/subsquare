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

export function getHomeMenu({ tracks = [], fellowshipTracks = [] } = {}) {
  return [
    commonMenus,
    getReferendaMenu(tracks),
    getFellowshipMenu(fellowshipTracks),
    democracy,
    treasury,
    council,
    techComm,
    financialCouncil,
    advisoryCommittee,
    alliance,
  ];
}

export const allHomeMenuNames = getHomeMenu()
  .map((menu) => menu.name)
  .filter(Boolean);

/**
 * @param {number} counts
 * @returns {'collapse' | 'expand'}
 * @description gt 3 collapse, otherwise expand
 */
export function getHomeMenuDefaultBehaviorByGroupCounts(counts = 0) {
  return counts > 3 ? "collapse" : "expand";
}
