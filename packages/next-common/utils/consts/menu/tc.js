import Chains from "../chains";
import DemocracyProposalIcon from "../../../assets/imgs/icons/type-proposals.svg";
import React from "react";
import MembersIcon from "../../../assets/imgs/icons/members.svg";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";

const techComm = {
  name: "TECH.COMM.",
  excludeToChains: [
    Chains.kabocha,
    Chains.centrifuge,
    Chains.altair,
    Chains.development,
    Chains["westend-collectives"],
    Chains.collectives,
  ],
  items: [
    {
      value: "techCommProposals",
      name: "Proposals",
      pathname: "/techcomm/proposals",
      icon: (
        <MenuIconWrapper>
          <DemocracyProposalIcon />
        </MenuIconWrapper>
      ),
    },
    {
      value: "techCommMembers",
      name: "Members",
      pathname: "/techcomm/members",
      icon: (
        <MenuIconWrapper>
          <MembersIcon />
        </MenuIconWrapper>
      ),
      excludeToChains: [
        Chains.kusama,
      ],
    },
  ],
};

export default techComm;
