import React from "react";
import Chains from "../chains";
import { MenuDemocracy } from "@osn/icons/subsquare";

export const Names = {
  democracy: "DEMOCRACY",
  referenda: "Referenda",
  democracyProposals: "Public Proposals",
  democracyExternals: "External Proposals",
};

export function getDemocracyMenu(summary) {
  const activeReferenda = summary?.referenda?.active || 0;
  const activePublicProposals = summary?.publicProposals?.active || 0;
  const activeExternalProposals = summary?.externalProposals?.active || 0;
  const totalActiveCount =
    activeReferenda + activePublicProposals + activeExternalProposals;

  return {
    name: Names.democracy,
    excludeToChains: [
      Chains.kabocha,
      Chains.development,
      Chains.westendCollectives,
      Chains.collectives,
      Chains.vara,
      Chains.westend,
      Chains.zkverifyTestnet,
    ],
    archivedToChains: [Chains.kusama, Chains.polkadot, Chains.rococo],
    activeCount: totalActiveCount,
    icon: <MenuDemocracy />,
    pathname: "/democracy",
    items: [
      {
        value: "referenda",
        name: Names.referenda,
        activeCount: activeReferenda,
        pathname: "/democracy/referenda",
        extraMatchNavMenuActivePathnames: [
          "/democracy/statistics",
          "/democracy/referenda/[id]",
        ],
      },
      {
        value: "democracyProposals",
        name: Names.democracyProposals,
        activeCount: activePublicProposals,
        pathname: "/democracy/proposals",
        extraMatchNavMenuActivePathnames: ["/democracy/proposals/[id]"],
      },
      {
        value: "democracyExternals",
        excludeToChains: [Chains.kintsugi, Chains.interlay],
        name: Names.democracyExternals,
        activeCount: activeExternalProposals,
        pathname: "/democracy/externals",
        extraMatchNavMenuActivePathnames: ["/democracy/externals/[id]"],
      },
    ],
  };
}

const democracy = getDemocracyMenu();

export default democracy;
