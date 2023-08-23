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
    Chains.vara,
  ],
  archivedToChains: [Chains.kusama],
  icon: <MenuDemocracy />,
  pathname: "/democracy",
  items: [
    {
      value: "referenda",
      name: "Referenda",
      pathname: "/democracy/referenda",
      extraMatchNavMenuActivePathnames: [
        "/democracy/statistics",
        "/democracy/referenda/[id]",
      ],
    },
    {
      value: "democracyProposals",
      name: "Public Proposals",
      pathname: "/democracy/proposals",
      extraMatchNavMenuActivePathnames: ["/democracy/proposals/[id]"],
    },
    {
      value: "democracyExternals",
      excludeToChains: [Chains.kintsugi, Chains.interlay],
      name: "External Proposals",
      pathname: "/democracy/externals",
      extraMatchNavMenuActivePathnames: ["/democracy/externals/[id]"],
    },
  ],
};

export default democracy;
