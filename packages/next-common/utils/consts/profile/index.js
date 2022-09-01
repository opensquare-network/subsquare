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
        routePath: "treasury-proposals",
        formatter: toTreasuryProposalListItem,
      },
      {
        id: "tips",
        name: "Proposed Tips",
        categoryName: "Proposed treasury tips",
        categoryId: businessCategory.treasuryTips,
        routePath: "tips",
        formatter: toTipListItem,
      },
    ],
  },
  {
    id: "democracy",
    name: "Democracy",
    children: [
      {
        id: "proposals",
        name: "Proposals",
        categoryName: "Proposed democracy proposals",
        categoryId: businessCategory.democracyProposals,
        routePath: "public-proposals",
        formatter: toPublicProposalListItem,
      },
      {
        id: "externals",
        name: "Externals",
        categoryName: "Proposed democracy externals",
        categoryId: businessCategory.democracyProposals,
        routePath: "external-proposals",
        formatter: toExternalProposalListItem,
      },
      {
        id: "referendums",
        name: "Referenda",
        categoryName: "Proposed democracy referenda",
        categoryId: businessCategory.democracyProposals,
        routePath: "referendums",
        formatter: toReferendaListItem,
      },
    ],
  },
  {
    id: "collectives",
    name: "Collectives",
    children: [
      {
        id: "councilMotions",
        name: "Council Motions",
        categoryName: "Council motions",
        categoryId: businessCategory.councilMotions,
        routePath: "council-motions",
        formatter: toCouncilMotionListItem,
      },
      {
        id: "techCommProposals",
        name: "Tech. Comm. Proposals",
        categoryName: "Tech. Comm. proposals",
        categoryId: businessCategory.tcProposals,
        routePath: "techcomm-proposals",
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
        formatter: (chain, comment) => comment,
      },
    ],
  },
];
