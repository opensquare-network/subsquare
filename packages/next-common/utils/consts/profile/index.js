import {
  toCouncilMotionListItem,
  toDiscussionListItem,
  toExternalProposalListItem,
  toPolkassemblyDiscussionListItem,
  toPublicProposalListItem,
  toReferendaListItem,
  toTechCommMotionListItem,
  toTipListItem,
  toTreasuryBountyListItem,
  toTreasuryProposalListItem,
} from "@subsquare/next/utils/viewfuncs";
import businessCategory from "../business/category";
import Chains from "../chains";

export const CATEGORIES = [
  {
    id: "democracy",
    name: "Democracy",
    children: [
      {
        id: "referendums",
        name: "Referenda",
        categoryName: "Proposed democracy referenda",
        categoryId: businessCategory.democracyReferenda,
        routePath: "democracy/referenda",
        apiPath: "referendums",
        formatter: toReferendaListItem,
      },
      {
        id: "externals",
        name: "Externals",
        categoryName: "Proposed democracy externals",
        categoryId: businessCategory.democracyExternals,
        routePath: "democracy/external",
        apiPath: "external-proposals",
        formatter: toExternalProposalListItem,
        excludeChains: [Chains.kintsugi],
      },
      {
        id: "proposals",
        name: "Proposals",
        categoryName: "Proposed democracy proposals",
        categoryId: businessCategory.democracyProposals,
        routePath: "democracy/proposals",
        apiPath: "public-proposals",
        formatter: toPublicProposalListItem,
      },
    ],
  },
  {
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
        formatter: toTreasuryProposalListItem,
      },
      {
        id: "bounties",
        name: "Bounties",
        categoryName: "Proposed treasury bounties",
        categoryId: businessCategory.treasuryBounties,
        routePath: "treasury/bounties",
        apiPath: "bounties",
        formatter: toTreasuryBountyListItem,
        excludeChains: [Chains.kintsugi],
      },
      {
        id: "tips",
        name: "Proposed Tips",
        categoryName: "Proposed treasury tips",
        categoryId: businessCategory.treasuryTips,
        routePath: "treasury/tips",
        apiPath: "tips",
        formatter: toTipListItem,
        excludeChains: [Chains.kintsugi],
      },
    ],
  },
  {
    id: "collectives",
    name: "Collective",
    children: [
      {
        id: "councilMotions",
        name: "Council Motions",
        categoryName: "Council motions",
        categoryId: businessCategory.councilMotions,
        routePath: "collective/council/motions",
        apiPath: "council-motions",
        formatter: toCouncilMotionListItem,
        excludeChains: [Chains.kintsugi],
      },
      {
        id: "techCommProposals",
        name: "Tech. Comm. Proposals",
        categoryName: "Tech. Comm. proposals",
        categoryId: businessCategory.tcProposals,
        routePath: "collective/techcomm/proposals",
        apiPath: "techcomm-proposals",
        formatter: toTechCommMotionListItem,
      },
    ],
  },
  {
    id: "discussions",
    name: "Discussions",
    children: [
      {
        id: "posts",
        name: "Posts",
        categoryName: "Discussions",
        categoryId: "Discussions",
        routePath: "posts",
        apiPath: "posts",
        formatter: toDiscussionListItem,
      },
      {
        id: "comments",
        name: "Comments",
        categoryName: "Comments",
        categoryId: "Comments",
        routePath: "comments",
        apiPath: "comments",
        formatter: (chain, comment) => comment,
      },
      {
        id: "polkassemblyDiscussions",
        name: "Polkassembly posts",
        categoryName: "Polkassembly Discussions",
        categoryId: "Polkassembly Discussions",
        routePath: "polkassembly-discussions",
        apiPath: "polkassembly-discussions",
        formatter: toPolkassemblyDiscussionListItem,
        excludeChains: (() => {
          const { kusama, polakdot, ...others } = Chains;
          return Object.values(others);
        })(),
      },
    ],
  },
];
