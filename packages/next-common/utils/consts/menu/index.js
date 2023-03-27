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
  const homeMenus = [
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

  const allHomeMenuNames = homeMenus.map((menu) => menu.name).filter(Boolean);

  return {
    homeMenus,
    allHomeMenuNames,
  };
}
