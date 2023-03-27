import commonMenus from "./common";
import democracy from "./democracy";
import treasury from "./treasury";
import council from "./council";
import techComm from "./tc";
import financialCouncil from "./financilCouncil";
import advisoryCommittee from "./advisoryCouncil";
import alliance from "./alliance";
import { resolveReferendaMenu, name as referendaMenuName } from "./referenda";
import {
  resolveFellowshipMenu,
  name as fellowshipMenuName,
} from "./fellowship";

export const allHomeMenuNames = [
  commonMenus,
  democracy,
  treasury,
  council,
  techComm,
  financialCouncil,
  advisoryCommittee,
  alliance,
  { name: referendaMenuName },
  { name: fellowshipMenuName },
].reduce((result, menu) => {
  if (menu.name) {
    return [...result, menu.name];
  }
  return result;
}, []);

export function getHomeMenu({ tracks = [], fellowshipTracks = [] } = {}) {
  const homeMenus = [
    commonMenus,
    resolveReferendaMenu(tracks),
    resolveFellowshipMenu(fellowshipTracks),
    democracy,
    treasury,
    council,
    techComm,
    financialCouncil,
    advisoryCommittee,
    alliance,
  ];

  const allHomeMenuNames = homeMenus.reduce((result, item) => {
    if (item.name) {
      return [...result, item.name];
    }

    return result;
  }, []);

  return {
    homeMenus,
    allHomeMenuNames,
  };
}
