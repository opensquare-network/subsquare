import {
  toCouncilMotionListItem,
  toDiscussionListItem,
  toPublicProposalListItem,
  toTechCommMotionListItem,
  toTipListItem,
  toTreasuryProposalListItem,
} from "@subsquare/next/utils/viewfuncs";
import { detailPageCategory } from "../business/category";

export const CATEGORIES = [
  {
    id: "treasury",
    name: "Treasury",
    children: [
      {
        id: "proposals",
        name: "Proposed Proposals",
        categoryName: "Proposed treasury proposals",
        categoryId: detailPageCategory.TREASURY_PROPOSAL,
        routePath: "treasury-proposals",
        formatter: toTreasuryProposalListItem,
      },
      {
        id: "tips",
        name: "Proposed Tips",
        categoryName: "Proposed treasury tips",
        categoryId: detailPageCategory.TREASURY_TIP,
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
        categoryId: detailPageCategory.DEMOCRACY_PROPOSALS,
        routePath: "public-proposals",
        formatter: toPublicProposalListItem,
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
        categoryId: detailPageCategory.COUNCIL_MOTION,
        routePath: "council-motions",
        formatter: toCouncilMotionListItem,
      },
      {
        id: "techCommProposals",
        name: "Tech. Comm. Proposals",
        categoryName: "Tech. Comm. proposals",
        categoryId: detailPageCategory.TECH_COMM_MOTION,
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
        categoryId: detailPageCategory.POST,
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
        categoryId: detailPageCategory.POST,
        routePath: "comments",
        formatter: (chain, comment) => comment,
      },
    ],
  },
];
