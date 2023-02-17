import React from "react";
import Chains from "../chains";
import ReferendaIcon from "../../../assets/imgs/icons/type-referenda.svg";
import DemocracyProposalIcon from "../../../assets/imgs/icons/type-proposals.svg";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";

const democracy = {
  name: "DEMOCRACY",
  excludeToChains: [Chains.kabocha, Chains.development, Chains["westend-collectives"]],
  items: [
    {
      value: "referenda",
      name: "Referenda",
      pathname: "/democracy/referenda",
      icon: (
        <MenuIconWrapper>
          <ReferendaIcon />
        </MenuIconWrapper>
      ),
    },
    {
      value: "democracyProposals",
      name: "Proposals",
      pathname: "/democracy/proposals",
      icon: (
        <MenuIconWrapper>
          <DemocracyProposalIcon />
        </MenuIconWrapper>
      ),
    },
    {
      value: "democracyExternals",
      excludeToChains: [Chains.kintsugi, Chains.interlay],
      name: "External",
      pathname: "/democracy/externals",
      icon: (
        <MenuIconWrapper>
          <DemocracyProposalIcon />
        </MenuIconWrapper>
      ),
    },
  ],
};

export default democracy;
