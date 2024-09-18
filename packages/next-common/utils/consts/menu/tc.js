import { MenuTechComm } from "@osn/icons/subsquare";
import getChainSettings from "../settings";
import { CHAIN } from "next-common/utils/constants";

export const Names = {
  techComm: "Technical Committee",
  techCommProposals: "Proposals",
  techCommMembers: "Members",
};

export function getTechCommMenu(summary) {
  const { modules } = getChainSettings(CHAIN);
  const archived = modules?.technicalCommittee?.archived;

  const activeTechCommMotions = summary?.techCommMotions?.active || 0;

  return {
    name: Names.techComm,
    activeCount: activeTechCommMotions,
    archived,
    icon: <MenuTechComm />,
    pathname: "/techcomm",
    items: [
      {
        value: "techCommProposals",
        name: Names.techCommProposals,
        pathname: "/techcomm/proposals",
        extraMatchNavMenuActivePathnames: ["/techcomm/proposals/[id]"],
        activeCount: activeTechCommMotions,
      },
      {
        value: "techCommMembers",
        name: Names.techCommMembers,
        pathname: "/techcomm/members",
      },
    ],
  };
}

const techComm = getTechCommMenu();

export default techComm;
