import { MenuOpenTechComm } from "@osn/icons/subsquare";

export const Names = {
  openTechCommittee: "OPEN TECH.COMM.",
  openTechCommitteeProposals: "Proposals",
  openTechCommitteeMembers: "Members",
};

export function getOpenTechCommMenu(summary) {
  const activeOpenTechCommMotions = summary?.openTechCommMotions?.active || 0;

  return {
    name: Names.openTechCommittee,
    icon: <MenuOpenTechComm />,
    activeCount: activeOpenTechCommMotions,
    items: [
      {
        value: "openTechCommitteeProposals",
        name: Names.openTechCommitteeProposals,
        pathname: "/open-techcomm/proposals",
        extraMatchNavMenuActivePathnames: ["/open-techcomm/proposals/[id]"],
        activeCount: activeOpenTechCommMotions,
      },
      {
        value: "openTechCommitteeMembers",
        name: Names.openTechCommitteeMembers,
        pathname: "/open-techcomm/members",
      },
    ],
  };
}

const openTechCommittee = getOpenTechCommMenu();

export default openTechCommittee;
