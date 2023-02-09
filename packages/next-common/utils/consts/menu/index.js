import commonMenus from "./common";
import democracy from "./democracy";
import treasury from "./treasury";
import council from "./council";
import techComm from "./tc";
import financialCouncil from "./financilCouncil";
import advisoryCommittee from "./advisoryCouncil";
import { gov2EntryMenu } from "./gov2";

const homeMenus = [
  commonMenus,
  gov2EntryMenu,
  democracy,
  treasury,
  council,
  techComm,
  financialCouncil,
  advisoryCommittee,
];

export const allHomeMenuNames = homeMenus.reduce((result, menu) => {
  if (menu.name) {
    return [...result, menu.name];
  }
  return result;
}, []);

export default homeMenus;
