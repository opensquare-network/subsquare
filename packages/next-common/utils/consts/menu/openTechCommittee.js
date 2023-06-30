import { MenuOpenTechComm } from "@osn/icons/subsquare";

const openTechCommittee = {
  name: "OPEN TECH.COMM.",
  icon: <MenuOpenTechComm />,
  items: [
    {
      value: "openTechCommitteeProposals",
      name: "Proposals",
      pathname: "/open-techcomm/proposals",
    },
    {
      value: "openTechCommitteeMembers",
      name: "Members",
      pathname: "/open-techcomm/members",
    },
  ],
};

export default openTechCommittee;
