import markdownToText from "./markdownToText";
import { ItemType, formatItems } from "./items";
import { normalizeWikiResults, WIKI_SEARCH_TYPE } from "./wiki";

export const FULL_TEXT_COMMENT_TYPE = "comment";

export const FULL_TEXT_COMMENTS_TYPE = "Comments";

// Keep in sync with SearchType / getSearchItemPath of common/commonList.js.
const IDENTITIES_SEARCH_TYPE = "Identities";
const PROJECTS_SEARCH_TYPE = "TreasuryFundedProjects";
const PROJECTS_CATEGORY_PATH = "/treasury/projects";

export const FULL_TEXT_PROPOSAL_TYPES = {
  referendaReferendum: {
    searchType: "Referenda",
    name: "Referenda",
    getIndex: (item) => item.referendumIndex,
    getPath: (index) => `/referenda/${index}`,
  },
  democracyReferendum: {
    searchType: "DemocracyReferenda",
    name: "Democracy Referenda",
    getIndex: (item) => item.referendumIndex,
    getPath: (index) => `/democracy/referenda/${index}`,
  },
  bounty: {
    searchType: "Bounties",
    name: "Bounties",
    getIndex: (item) => item.bountyIndex,
    getPath: (index) => `/treasury/bounties/${index}`,
  },
  childBounty: {
    searchType: "ChildBounties",
    name: "Child Bounties",
    getIndex: getChildBountyIndex,
    getDisplayIndex: getChildBountyDisplayIndex,
    getPath: (index) => `/treasury/child-bounties/${index}`,
  },
  tip: {
    searchType: "TreasuryTips",
    name: "Treasury Tips",
    getIndex: (item) => item.hash,
    getPath: (index) => `/treasury/tips/${index}`,
    noDisplayIndex: true,
  },
  treasuryProposal: {
    searchType: "TreasuryProposals",
    name: "Treasury Proposals",
    getIndex: (item) => item.proposalIndex,
    getPath: (index) => `/treasury/proposals/${index}`,
  },
  treasurySpend: {
    searchType: "TreasurySpends",
    name: "Treasury Spends",
    getIndex: (item) => item.index,
    getPath: (index) => `/treasury/spends/${index}`,
  },
  fellowshipReferendum: {
    searchType: "FellowshipReferenda",
    name: "Fellowship Referenda",
    getIndex: (item) => item.referendumIndex,
    getPath: (index) => `/fellowship/referenda/${index}`,
  },
  fellowshipTreasurySpend: {
    searchType: "FellowshipTreasurySpends",
    name: "Fellowship Treasury Spends",
    getIndex: (item) => item.index,
    getPath: (index) => `/fellowship/treasury/spends/${index}`,
  },
};

export const FULL_TEXT_PROPOSAL_TYPE_ORDER = [
  "referendaReferendum",
  "democracyReferendum",
  "bounty",
  "childBounty",
  "treasuryProposal",
  "treasurySpend",
  "tip",
  "fellowshipReferendum",
  "fellowshipTreasurySpend",
];

export function formatFullTextResults(results) {
  if (!results) return null;

  const { items = [], projects = [], wiki = [], identities = [] } = results;

  return [
    ...formatRawItems(IDENTITIES_SEARCH_TYPE, identities),
    ...formatRawItems(WIKI_SEARCH_TYPE, normalizeWikiResults(wiki)),
    ...formatProjectSection(projects),
    ...formatProposalSections(items),
    ...formatCommentSection(items),
  ];
}

function formatRawItems(proposalType, items) {
  if (!items?.length) {
    return [];
  }

  return [
    {
      proposalType,
      type: ItemType.CATEGORY,
    },
    ...items.map((item) => ({
      ...item,
      proposalType,
      type: ItemType.ITEM,
    })),
  ];
}

function formatProjectSection(projects) {
  const rows = formatItems(
    PROJECTS_SEARCH_TYPE,
    normalizeProjects(projects),
    "id",
    "id",
    true,
    true,
  );

  return rows.map((row) => ({
    ...row,
    path: row.type === ItemType.CATEGORY ? PROJECTS_CATEGORY_PATH : null,
  }));
}

function formatProposalSections(items) {
  return FULL_TEXT_PROPOSAL_TYPE_ORDER.flatMap((type) => {
    const meta = FULL_TEXT_PROPOSAL_TYPES[type];
    const sectionItems = items
      .filter((item) => item.type === type)
      .map(toDisplayItem);

    return formatItems(
      meta.searchType,
      sectionItems,
      meta.getIndex,
      meta.getDisplayIndex ?? meta.getIndex,
      meta.noDisplayIndex,
    );
  });
}

function toDisplayItem(item) {
  return {
    ...item,
    content: markdownToText(item.content || ""),
    highlight: item.highlight
      ? {
          title: item.highlight.title ?? null,
          content: item.highlight.content
            ? markdownToText(item.highlight.content)
            : null,
        }
      : null,
  };
}

function formatCommentSection(items) {
  const rows = items
    .filter((item) => item.type === FULL_TEXT_COMMENT_TYPE)
    .map(toCommentRow)
    .filter(Boolean);

  if (!rows.length) {
    return [];
  }

  return [
    {
      proposalType: FULL_TEXT_COMMENTS_TYPE,
      title: "Comments",
      type: ItemType.CATEGORY,
      path: null,
    },
    ...rows,
  ];
}

function toCommentRow(comment) {
  const meta = FULL_TEXT_PROPOSAL_TYPES[comment.postType];
  if (!meta) {
    return null;
  }

  const index = meta.getIndex(comment);
  const displayIndex = (meta.getDisplayIndex ?? meta.getIndex)(comment);

  return {
    proposalType: FULL_TEXT_COMMENTS_TYPE,
    type: ItemType.ITEM,
    path: `${meta.getPath(index)}#${comment.height}`,
    title: `${meta.name} #${displayIndex}`,
    content: markdownToText(comment.content || "-"),
    highlight: comment.highlight?.content
      ? { content: markdownToText(comment.highlight.content) }
      : null,
  };
}

function normalizeProjects(projects = []) {
  return projects
    .map((project) => ({
      ...project,
      title: project.name ?? "-",
      content: project.description ?? "-",
    }))
    .sort((a, b) => b.fiatAtFinal - a.fiatAtFinal);
}

function getChildBountyIndex(item) {
  const base = `${item.parentBountyId}_${item.index}`;
  return item.hasSameParentAndIndex
    ? `${base}_${item.indexerBlockHeight}`
    : base;
}

function getChildBountyDisplayIndex(item) {
  return `${item.parentBountyId}_${item.index}`;
}
