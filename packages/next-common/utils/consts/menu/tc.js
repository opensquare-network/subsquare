import Chains from "../chains";
import DemocracyProposalIcon from "../../../assets/imgs/icons/type-proposals.svg";
import React from "react";
import MembersIcon from "../../../assets/imgs/icons/members.svg";

const techComm = {
  name: "TECH.COMM.",
  excludeToChains: [Chains.kabocha, Chains.centrifuge],
  items: [
    {
      value: "techCommProposals",
      name: "Proposals",
      pathname: "/techcomm/proposals",
      icon: <DemocracyProposalIcon />,
    },
    {
      value: "techCommMembers",
      name: "Members",
      pathname: "/techcomm/members",
      icon: <MembersIcon />,
    },
  ],
};

export default techComm;
