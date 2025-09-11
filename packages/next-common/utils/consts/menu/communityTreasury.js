import { MenuTreasury } from "@osn/icons/subsquare";

export const Names = {
  communityTreasury: "COMMUNITY TREASURY",
  proposals: "Proposals",
};

export function getCommunityTreasuryMenu(summary) {
  const activeTreasuryProposals =
    summary?.communityTreasuryProposals?.active || 0;
  const totalActiveCount = activeTreasuryProposals;

  return {
    name: Names.communityTreasury,
    icon: <MenuTreasury />,
    pathname: "/community-treasury",
    activeCount: totalActiveCount,
    items: [
      {
        value: "proposals",
        name: Names.proposals,
        pathname: "/community-treasury/proposals",
        extraMatchNavMenuActivePathnames: [
          "/community-treasury/proposals/[id]",
        ],
        activeCount: activeTreasuryProposals,
      },
    ],
  };
}

const communityTreasury = getCommunityTreasuryMenu();

export default communityTreasury;
