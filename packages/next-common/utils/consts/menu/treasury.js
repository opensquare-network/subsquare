import { MenuTreasury } from "@osn/icons/subsquare";
import getChainSettings from "../settings";
import { CHAIN, NAV_MENU_TYPE } from "next-common/utils/constants";

export const Names = {
  status: "Status",
  treasury: "TREASURY",
  proposals: "Proposals",
  spends: "Spends",
  bounties: "Bounties",
  childBounties: "Child Bounties",
  tips: "Tips",
  burnt: "Burnt",
};

export function getTreasuryMenu(summary) {
  const {
    modules: { treasury },
  } = getChainSettings(CHAIN);

  const activeTreasuryProposals = summary?.treasuryProposals?.active || 0;
  const activeTreasurySpends = summary?.treasurySpends?.active || 0;
  const activeBounties = summary?.bounties?.active || 0;
  const activeChildBounties = summary?.childBounties?.active || 0;
  const activeTips = summary?.tips?.active || 0;
  const totalActiveCount =
    activeTreasuryProposals +
    activeTreasurySpends +
    activeBounties +
    activeChildBounties +
    activeTips;

  return {
    name: Names.treasury,
    icon: <MenuTreasury />,
    pathname: "/treasury",
    activeCount: totalActiveCount,
    type: NAV_MENU_TYPE.group,
    items: [
      treasury?.status && {
        value: "status",
        name: Names.status,
        pathname: "/treasury",
      },
      treasury?.spends && {
        value: "spends",
        name: Names.spends,
        pathname: "/treasury/spends",
        extraMatchNavMenuActivePathnames: ["/treasury/spends/[id]"],
        activeCount: activeTreasurySpends,
      },
      treasury?.proposals && {
        value: "proposals",
        name: Names.proposals,
        pathname: "/treasury/proposals",
        extraMatchNavMenuActivePathnames: ["/treasury/proposals/[id]"],
        activeCount: activeTreasuryProposals,
      },
      treasury?.bounties && {
        value: "bounties",
        name: Names.bounties,
        pathname: "/treasury/bounties",
        extraMatchNavMenuActivePathnames: ["/treasury/bounties/[id]"],
        activeCount: activeBounties,
      },
      treasury?.childBounties && {
        value: "child-bounties",
        name: Names.childBounties,
        pathname: "/treasury/child-bounties",
        extraMatchNavMenuActivePathnames: ["/treasury/child-bounties/[id]"],
        activeCount: activeChildBounties,
      },
      treasury?.tips && {
        value: "tips",
        name: Names.tips,
        pathname: "/treasury/tips",
        extraMatchNavMenuActivePathnames: ["/treasury/tips/[id]"],
        archived: treasury?.tips?.archived,
        activeCount: activeTips,
      },
      treasury?.burnt && {
        value: "burnt",
        name: Names.burnt,
        pathname: "/treasury/burnt",
      },
    ].filter(Boolean),
  };
}

const treasury = getTreasuryMenu();

export default treasury;
