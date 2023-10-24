import { MenuOpenTechComm } from "@osn/icons/subsquare";

export const Names = {
  openTechCommittee: "OPEN TECH.COMM.",
  openTechCommitteeProposals: "Proposals",
  openTechCommitteeMembers: "Members",
};

const openTechCommittee = {
  name: Names.openTechCommittee,
  icon: <MenuOpenTechComm />,
  items: [
    {
      value: "openTechCommitteeProposals",
      name: Names.openTechCommitteeProposals,
      pathname: "/open-techcomm/proposals",
      extraMatchNavMenuActivePathnames: ["/open-techcomm/proposals/[id]"],
    },
    {
      value: "openTechCommitteeMembers",
      name: Names.openTechCommitteeMembers,
      pathname: "/open-techcomm/members",
    },
  ],
};

export default openTechCommittee;
