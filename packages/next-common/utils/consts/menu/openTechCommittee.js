import { MenuTechComm } from "@osn/icons/subsquare";

const openTechCommittee = {
  name: "OPEN TECH.COMM.",
  items: [
    {
      value: "openTechCommitteeProposals",
      name: "Proposals",
      pathname: "/open-techcomm/proposals",
      icon: <MenuTechComm />,
    },
    {
      value: "openTechCommitteeMembers",
      name: "Members",
      pathname: "/open-techcomm/members",
    },
  ],
};

export default openTechCommittee;
