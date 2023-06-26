import React from "react";
import Chains from "../chains";
import { MenuDemocracy } from "@osn/icons/subsquare";

const democracy = {
  name: "DEMOCRACY",
  excludeToChains: [
    Chains.kabocha,
    Chains.development,
    Chains["westend-collectives"],
    Chains.collectives,
  ],
  icon: <MenuDemocracy />,
  pathname: "/democracy",
  items: [
    {
      value: "referenda",
      name: "Referenda",
      pathname: "/democracy/referenda",
    },
    {
      value: "democracyProposals",
      name: "Proposals",
      pathname: "/democracy/proposals",
    },
    {
      value: "democracyExternals",
      excludeToChains: [Chains.kintsugi, Chains.interlay],
      name: "External",
      pathname: "/democracy/externals",
    },
  ],
};

export default democracy;
