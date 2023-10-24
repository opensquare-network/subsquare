import React from "react";
import Chains from "../chains";
import { MenuDemocracy } from "@osn/icons/subsquare";

export const Names = {
  democracy: "DEMOCRACY",
  referenda: "Referenda",
  democracyProposals: "Public Proposals",
  democracyExternals: "External Proposals",
};

const democracy = {
  name: Names.democracy,
  excludeToChains: [
    Chains.kabocha,
    Chains.development,
    Chains["westend-collectives"],
    Chains.collectives,
    Chains.vara,
  ],
  archivedToChains: [Chains.kusama],
  icon: <MenuDemocracy />,
  pathname: "/democracy",
  items: [
    {
      value: "referenda",
      name: Names.referenda,
      pathname: "/democracy/referenda",
      extraMatchNavMenuActivePathnames: [
        "/democracy/statistics",
        "/democracy/referenda/[id]",
      ],
    },
    {
      value: "democracyProposals",
      name: Names.democracyProposals,
      pathname: "/democracy/proposals",
      extraMatchNavMenuActivePathnames: ["/democracy/proposals/[id]"],
    },
    {
      value: "democracyExternals",
      excludeToChains: [Chains.kintsugi, Chains.interlay],
      name: Names.democracyExternals,
      pathname: "/democracy/externals",
      extraMatchNavMenuActivePathnames: ["/democracy/externals/[id]"],
    },
  ],
};

export default democracy;
