import markdownToText from "./markdownToText";
import { ItemType, formatItems } from "./items";
import { normalizeWikiResults, WIKI_SEARCH_TYPE } from "./wiki";

// The `type` of a comment document of the full text search results
// (meilisearch), see the sync-meilisearch script of the backend.
export const FULL_TEXT_COMMENT_TYPE = "comment";

// The proposal type of the comment rows of the full text search dialog. It is
// only used to tell the comment rows apart when rendering the list, a comment
// row links to the post the comment belongs to.
export const FULL_TEXT_COMMENTS_TYPE = "Comments";

// The search types and the paths of the rows of the full text search dialog
// must be identical to the SearchType values and the getSearchItemPath
// results of the index based search dialog (see common/commonList.js of the
// header search), because the rows are rendered and linked by the very same
// item components. The two are intentionally kept in sync by hand.
const IDENTITIES_SEARCH_TYPE = "Identities"; // SearchType.IDENTITIES
const PROJECTS_SEARCH_TYPE = "TreasuryFundedProjects"; // SearchType.TREASURY_FUNDED_PROJECTS
const PROJECTS_CATEGORY_PATH = "/treasury/projects";

// Metadata of every kind of proposal of the full text search results
// (meilisearch), see the sync-meilisearch script of the backend. The search
// type decides how an item is rendered and linked, the index getters pick the
// fields of the meilisearch document that locate the post on chain.
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

// The order of the proposal sections of the full text search dialog.
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

// Builds the rows of the full text search dialog from the result of the full
// text search API of the backend. A section without any item is hidden.
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

// The identities and the wiki docs of the API result are rendered as they are,
// see the identity and wiki search item renderers.
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

  // A project is opened in a popup on click, there is no detail page to
  // navigate to, so the keyboard navigation only links the category.
  return rows.map((row) => ({
    ...row,
    path: row.type === ItemType.CATEGORY ? PROJECTS_CATEGORY_PATH : null,
  }));
}

// The proposals of the full text search are grouped into one section per
// proposal type, the empty sections are hidden.
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

// The content of a full text search item is a cropped snippet of markdown
// text, and the highlight fields carry the matched words marked by <em> tags.
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

// A comment row locates the post the comment belongs to in its title, and
// jumps to the comment itself with its link. The `postType` of a comment
// document is the proposal type of the post the comment belongs to.
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
