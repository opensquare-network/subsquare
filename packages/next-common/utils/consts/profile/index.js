import {
  toDiscussionListItem,
  toPublicProposalListItem,
  toTipListItem,
  toTreasuryProposalListItem,
} from "@subsquare/next/utils/viewfuncs";

export const CATEGORIES = [
  {
    id: "treasury",
    name: "Treasury",
    children: [
      {
        id: "proposals",
        name: "Proposed Proposals",
        routePath: "treasury-proposals",
        formatter: toTreasuryProposalListItem,
      },
      {
        id: "tips",
        name: "Proposed Tips",
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
        routePath: "public-proposals",
        formatter: toPublicProposalListItem,
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
        routePath: "comments",
        formatter: (chain, comment) => comment,
      },
    ],
  },
];
