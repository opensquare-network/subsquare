import {
  toCouncilMotionListItem,
  toDiscussionListItem,
  toExternalProposalListItem,
  toPublicProposalListItem,
  toReferendaListItem,
  toTechCommMotionListItem,
  toTipListItem,
  toTreasuryProposalListItem,
} from "@subsquare/next/utils/viewfuncs";
import businessCategory from "../business/category";
import Chains from "../chains";

export const CATEGORIES = [
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
        id: "tips",
        name: "Proposed Tips",
        categoryName: "Proposed treasury tips",
        categoryId: businessCategory.treasuryTips,
        routePath: "treasury/tips",
        apiPath: "tips",
        formatter: toTipListItem,
        excludeChains: [Chains.kintsugi],
      },
      //todo: add bounties
    ],
  },
  {
    id: "democracy",
    name: "Democracy",
    children: [
      {
        id: "referendums",
        name: "Referenda",
        categoryName: "Proposed democracy referenda",
        categoryId: businessCategory.democracyProposals,
        routePath: "democracy/referenda",
        apiPath: "referendums",
        formatter: toReferendaListItem,
      },
      {
        id: "externals",
        name: "Externals",
        categoryName: "Proposed democracy externals",
        categoryId: businessCategory.democracyProposals,
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
        id: "discussions",
        name: "Discussions",
        categoryName: "Discussions",
        categoryId: "Discussions",
        routePath: "posts",
        apiPath: "posts",
        formatter: toDiscussionListItem,
      },
    ],
  },
  {
    id: "comments",
    name: "Comments",
    children: [
      {
        id: "comments",
        name: "Comments",
        categoryName: "Comments",
        categoryId: "Comments",
        routePath: "comments",
        apiPath: "comments",
        formatter: (chain, comment) => comment,
      },
    ],
  },
];
