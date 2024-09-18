import Chains from "../chains";
import { getExcludeChains } from "../../viewfuncs";
import { MenuTreasury } from "@osn/icons/subsquare";
import getChainSettings from "../settings";
import { CHAIN } from "next-common/utils/constants";

export const Names = {
  treasury: "TREASURY",
  proposals: "Proposals",
  spends: "Spends",
  bounties: "Bounties",
  childBounties: "Child Bounties",
  tips: "Tips",
};

export const SpendsSupportingChains = [Chains.polkadot];

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
    excludeToChains: [
      Chains.kabocha,
      Chains.westendCollectives,
      Chains.collectives,
      Chains.zkverifyTestnet,
    ],
    icon: <MenuTreasury />,
    pathname: "/treasury",
    activeCount: totalActiveCount,
    items: [
      {
        value: "spends",
        name: Names.spends,
        pathname: "/treasury/spends",
        extraMatchNavMenuActivePathnames: ["/treasury/spends/[id]"],
        excludeToChains: getExcludeChains(SpendsSupportingChains),
        activeCount: activeTreasurySpends,
      },
      {
        value: "proposals",
        name: Names.proposals,
        pathname: "/treasury/proposals",
        extraMatchNavMenuActivePathnames: ["/treasury/proposals/[id]"],
        activeCount: activeTreasuryProposals,
      },
      {
        value: "bounties",
        name: Names.bounties,
        pathname: "/treasury/bounties",
        extraMatchNavMenuActivePathnames: ["/treasury/bounties/[id]"],
        excludeToChains: [
          Chains.basilisk,
          Chains.hydradx,
          Chains.hydradxTestnet,
          Chains.kintsugi,
          Chains.interlay,
          Chains.zeitgeist,
          Chains.centrifuge,
          Chains.altair,
          Chains.darwinia2,
          Chains.moonriver,
          Chains.moonbeam,
          Chains.vara,
          Chains.shibuya,
          Chains.astar,
        ],
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
    ].filter(Boolean),
  };
}

const treasury = getTreasuryMenu();

export default treasury;
