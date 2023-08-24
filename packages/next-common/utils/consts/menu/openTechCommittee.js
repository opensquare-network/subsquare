import { MenuOpenTechComm } from "@osn/icons/subsquare";

const openTechCommittee = {
  name: "OPEN TECH.COMM.",
  icon: <MenuOpenTechComm />,
  items: [
    {
      value: "openTechCommitteeProposals",
      name: "Proposals",
      pathname: "/open-techcomm/proposals",
      extraMatchNavMenuActivePathnames: ["/open-techcomm/proposals/[id]"],
    },
    {
      value: "openTechCommitteeMembers",
      name: "Members",
      pathname: "/open-techcomm/members",
    },
  ],
};

export default openTechCommittee;
