import { MenuDemocracy } from "@osn/icons/subsquare";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "../settings";

export const Names = {
  democracy: "DEMOCRACY",
  referenda: "Referenda",
  democracyProposals: "Public Proposals",
  democracyExternals: "External Proposals",
};

export function getDemocracyMenu(summary) {
  const { modules } = getChainSettings(CHAIN);
  const archived = modules?.democracy?.archived;

  const activeReferenda = summary?.referenda?.active || 0;
  const activePublicProposals = summary?.publicProposals?.active || 0;
  const activeExternalProposals = summary?.externalProposals?.active || 0;
  const totalActiveCount =
    activeReferenda + activePublicProposals + activeExternalProposals;

  return {
    name: Names.democracy,
    activeCount: totalActiveCount,
    archived,
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
