import businessCategory from "../../business/category";
import Chains from "../../chains";
import normalizeTreasuryProposalListItem from "../../../viewfuncs/treasury/normalizeProposalListItem";
import normalizeBountyListItem from "../../../viewfuncs/treasury/normalizeBountyListItem";
import normalizeTipListItem from "../../../viewfuncs/treasury/normalizeTipListItem";

export const treasuryCategory = {
  id: "treasury",
  name: "Treasury",
  children: [
    {
      id: "proposals",
      name: "Proposed Proposals",
      categoryName: "Proposed treasury proposals",
      categoryId: businessCategory.treasuryProposals,
      routePath: "treasury/proposals",
      apiPath: "treasury-proposals",
      formatter: normalizeTreasuryProposalListItem,
    },
    {
      id: "bounties",
      name: "Bounties",
      categoryName: "Proposed treasury bounties",
      categoryId: businessCategory.treasuryBounties,
      routePath: "treasury/bounties",
      apiPath: "bounties",
      formatter: normalizeBountyListItem,
      excludeChains: [Chains.kintsugi, Chains.interlay],
    },
    {
      id: "tips",
      name: "Proposed Tips",
      categoryName: "Proposed treasury tips",
      categoryId: businessCategory.treasuryTips,
      routePath: "treasury/tips",
      apiPath: "tips",
      formatter: normalizeTipListItem,
      excludeChains: [Chains.kintsugi, Chains.interlay],
    },
  ],
  excludeChains: [Chains.collectives],
};
