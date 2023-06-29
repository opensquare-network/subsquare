import businessCategory from "../../business/category";
import Chains from "../../chains";
import normalizeTechCommMotionListItem from "../../../viewfuncs/collective/normalizeTechCommMotionListItem";
import normalizeReferendaListItem from "../../../viewfuncs/democracy/normalizeReferendaListItem";
import normalizeExternalListItem from "../../../viewfuncs/democracy/normliazeExternalListItem";
import normalizeProposalListItem from "../../../viewfuncs/democracy/normalizeProposalListItem";
import normalizeTreasuryProposalListItem from "../../../viewfuncs/treasury/normalizeProposalListItem";
import normalizeBountyListItem from "../../../viewfuncs/treasury/normalizeBountyListItem";
import normalizeTipListItem from "../../../viewfuncs/treasury/normalizeTipListItem";
import normalizeCouncilMotionListItem from "../../../viewfuncs/collective/normalizeCouncilMotionListItem";
import normalizeDiscussionListItem from "../../../viewfuncs/discussion/normalizeDiscussionListItem";
import normalizePolkassemblyDiscussionListItem from "../../../viewfuncs/discussion/normalizePaListItem";
import isMoonChain from "next-common/utils/isMoonChain";
import normalizeOpenTechCommProposalListItem from "next-common/utils/viewfuncs/collective/normalizeOpenTechCommProposalListItem";
import normalizeTreasuryCouncilMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTreasuryCouncilMotionListItem";

const commonCategories = [
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
        formatter: normalizeReferendaListItem,
      },
      {
        id: "externals",
        name: "Externals",
        categoryName: "Proposed democracy externals",
        categoryId: businessCategory.democracyExternals,
        routePath: "democracy/externals",
        apiPath: "external-proposals",
        formatter: normalizeExternalListItem,
        excludeChains: [Chains.kintsugi, Chains.interlay],
      },
      {
        id: "proposals",
        name: "Proposals",
        categoryName: "Proposed democracy proposals",
        categoryId: businessCategory.democracyProposals,
        routePath: "democracy/proposals",
        apiPath: "public-proposals",
        formatter: normalizeProposalListItem,
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
  },
  {
    id: "collectives",
    name: "Collective",
    children: [
      ...(
        isMoonChain() ? [
          {
            id: "councilMotions",
            name: "Council Motions",
            categoryName: "Council motions",
            categoryId: businessCategory.councilMotions,
            routePath: "council/motions",
            apiPath: "moon-council-motions",
            formatter: normalizeCouncilMotionListItem,
          },
          {
            id: "treasuryCouncilMotions",
            name: "Treasury Council Motions",
            categoryName: "Treasury Council motions",
            categoryId: businessCategory.treasuryCouncilMotions,
            routePath: "treasury-council/motions",
            apiPath: "council-motions",
            formatter: normalizeTreasuryCouncilMotionListItem,
          },
        ] : [
          {
            id: "councilMotions",
            name: "Council Motions",
            categoryName: "Council motions",
            categoryId: businessCategory.councilMotions,
            routePath: "council/motions",
            apiPath: "council-motions",
            formatter: normalizeCouncilMotionListItem,
            excludeChains: [Chains.kintsugi, Chains.interlay],
          },
        ]
      ),
      {
        id: "techCommProposals",
        name: "Tech. Comm. Proposals",
        categoryName: "Tech. Comm. proposals",
        categoryId: businessCategory.tcProposals,
        routePath: "techcomm/proposals",
        apiPath: "techcomm-proposals",
        formatter: normalizeTechCommMotionListItem,
      },
      ...(
        isMoonChain() ? [
          {
            id: "openTechCommProposals",
            name: "Open Tech. Comm. Proposals",
            categoryName: "Open Tech. Comm. proposals",
            categoryId: businessCategory.openTechCommitteeProposals,
            routePath: "open-techcomm/proposals",
            apiPath: "open-techcomm-proposals",
            formatter: normalizeOpenTechCommProposalListItem,
          },
        ] : []
      ),
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
        routePath: "discussions",
        apiPath: "posts",
        formatter: normalizeDiscussionListItem,
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
        routePath: "polkassembly/discussions",
        apiPath: "polkassembly-discussions",
        formatter: normalizePolkassemblyDiscussionListItem,
        excludeChains: (() => {
          return Object.values(Chains).filter(
            (v) => ![Chains.kusama, Chains.polkadot].includes(v),
          );
        })(),
      },
    ],
  },
];

export default commonCategories;
