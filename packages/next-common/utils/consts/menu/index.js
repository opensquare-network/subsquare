import commonMenus from "./common";
import democracy from "./democracy";
import treasury from "./treasury";
import council from "./council";
import techComm from "./tc";
import financialCouncil from "./financilCouncil";
import advisoryCommittee from "./advisoryCouncil";
import { gov2EntryMenu } from "./gov2";
import alliance from "./alliance";
import { resolveReferendaMenu } from "./referenda";
import { resolveFellowshipMenu } from "./fellowship";

const homeMenus = [
  commonMenus,
  gov2EntryMenu,
  democracy,
  treasury,
  council,
  techComm,
  financialCouncil,
  advisoryCommittee,
  alliance,
];

export const allHomeMenuNames = homeMenus.reduce((result, menu) => {
  if (menu.name) {
    return [...result, menu.name];
  }
  return result;
}, []);

export function resolveHomeMenu({ tracks = [], fellowshipTracks = [] }) {
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

export default homeMenus;
