import Chains from "../chains";

const techComm = {
  name: "TECH.COMM.",
  excludeToChains: [Chains.kabocha, Chains.centrifuge],
  items: [
    {
      value: "techCommProposals",
      name: "Proposals",
      pathname: "/techcomm/proposals",
    },
    {
      value: "techCommMembers",
      name: "Members",
      pathname: "/techcomm/members",
    },
  ],
};

export default techComm;
