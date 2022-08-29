import React from "react";
import Chains from "../chains";
import ReferendaIcon from "../../../assets/imgs/icons/type-referenda.svg";
import DemocracyProposalIcon from "../../../assets/imgs/icons/type-proposals.svg";

const democracy = {
  name: "DEMOCRACY",
  excludeToChains: [Chains.kabocha],
  items: [
    {
      value: "referenda",
      name: "Referenda",
      pathname: "/democracy/referenda",
      icon: <ReferendaIcon />,
    },
    {
      value: "democracyProposals",
      name: "Proposals",
      pathname: "/democracy/proposals",
      icon: <DemocracyProposalIcon />,
    },
    {
      value: "democracyExternals",
      excludeToChains: [Chains.kintsugi, Chains.interlay],
      name: "External",
      pathname: "/democracy/externals",
      icon: <DemocracyProposalIcon />,
    },
  ],
};

export default democracy;
