import { addressEllipsis } from "next-common/utils";
import { getMotionId } from "next-common/utils/motion";
import isNil from "lodash.isnil";
import { getGov2ReferendumTitle } from "next-common/utils/gov2/title";
import { parseGov2TrackName } from "next-common/utils/gov2";
import { getPostUpdatedAt, getTitle } from "./common";

export const TipStateMap = {
  NewTip: "Tipping",
  tip: "Tipping",
  Tipping: "Tipping",
  TipRetracted: "Retracted",
  TipClosed: "Closed",
};

export function getTipState(state) {
  if (!state) {
    return "Unknown";
  }
  return TipStateMap[state.state ?? state] === "Tipping"
    ? `Tipping (${state.tipsCount})`
    : TipStateMap[state.state ?? state];
}

export const toDiscussionListItem = (chain, item) => ({
  ...item,
  time: item.lastActivityAt,
  detailLink: `/post/${item.postUid}`,
});

export const convertPolkassemblyUser = (chain, paUser) =>
  paUser?.[`${chain}_default_address`]
    ? {
        username:
          addressEllipsis(paUser?.[`${chain}_default_address`]) ||
          paUser?.username,
        address: paUser?.[`${chain}_default_address`],
      }
    : {
        username: paUser?.username,
      };

export const convertPolkassemblyReaction = (chain, paReaction) => ({
  user: convertPolkassemblyUser(chain, paReaction?.reacting_user),
  reaction: paReaction.reaction === "👍" ? 1 : 0,
  createdAt: paReaction.created_at,
  updatedAt: paReaction.updated_at,
});

export const convertPolkassemblyComment = (chain, comment) => ({
  reactions: comment.comment_reactions?.map((r) =>
    convertPolkassemblyReaction(chain, r)
  ),
  id: comment.id,
  content: comment.content,
  createdAt: comment.created_at,
  updatedAt: comment.updated_at,
  author: convertPolkassemblyUser(chain, comment.author),
});

export const toPolkassemblyDiscussionAuthor = (author) => ({
  username: addressEllipsis(author?.address) || author?.username,
  ...(author?.address
    ? {
        address: author.address,
      }
    : {}),
});

export const toPolkassemblyDiscussionListItem = (chain, item) => ({
  ...item,
  time: item.lastActivityAt,
  author: toPolkassemblyDiscussionAuthor(item.author),
  detailLink: `/polkassembly/post/${item.polkassemblyId}`,
});

export const toPolkassemblyCommentListItem = (chain, item) => ({
  ...convertPolkassemblyComment(chain, item),
  replies: item.replies?.map((r) => convertPolkassemblyComment(chain, r)),
});

function getMotionState(item = {}) {
  if (!item.state) {
    return "Unknown";
  }

  const voting = "Voting";
  if (item.state !== voting) {
    return item.state;
  }

  const { tally: { yesVotes } = {}, voting: { ayes = [] } = {} } =
    item.onchainData || {};
  const ayeCount = isNil(yesVotes) ? ayes.length : yesVotes;
  return isNil(yesVotes) ? voting : `${voting} (${ayeCount})`;
}

export const toCouncilMotionListItem = (chain, item) => {
  return {
    ...item,
    index: item.motionIndex,
    title: getTitle(item),
    author: item.author,
    address: item.proposer,
    status: getMotionState(item),
    detailLink: `/council/motion/${getMotionId(item)}`,
    isTreasury:
      item?.onchainData?.treasuryProposals?.length > 0 ||
      item?.onchainData?.treasuryBounties?.length > 0,
    isDemocracy: item?.onchainData?.externalProposals?.length > 0,
    time: getPostUpdatedAt(item),
  };
};

export const toFinancialMotionsListItem = (chain, item) => ({
  ...item,
  index: item.motionIndex,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  status: item.state?.state ?? "Unknown",
  detailLink: `/financial-council/motion/${getMotionId(item)}`,
  time: getPostUpdatedAt(item),
});

export const toTechCommMotionListItem = (chain, item) => ({
  ...item,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  status: item?.state ?? "Unknown",
  detailLink: `/techcomm/proposal/${getMotionId(item)}`,
  time: getPostUpdatedAt(item),
  isDemocracy: item?.onchainData?.externalProposals?.length > 0,
});

export const toAdvisoryMotionsListItem = (chain, item) => ({
  ...item,
  index: item.motionIndex,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  status: item.state ?? "Unknown",
  detailLink: `/advisory-committee/motion/${getMotionId(item)}`,
  time: getPostUpdatedAt(item),
});

function getTreasuryProposalTitle(item) {
  let title = item.title?.trim();
  if (title) {
    return title;
  }

  const trackName = item?.onchainData?.track?.name;
  if (trackName) {
    const parsedTrackName = parseGov2TrackName(trackName);
    return `[${parsedTrackName}] Referendum #${item?.onchainData?.gov2Referendum}`;
  }

  return "--";
}

export const toTreasuryProposalListItem = (chain, item) => ({
  ...item,
  title: getTreasuryProposalTitle(item),
  author: item.author,
  address: item.proposer,
  status: item.state ?? "Unknown",
  time: getPostUpdatedAt(item),
  detailLink: `/treasury/proposal/${item.proposalIndex}`,
  value: item.onchainData?.value,
  index: item.proposalIndex,
});

export const toTreasuryBountyListItem = (chain, item) => ({
  ...item,
  title: getTitle(item),
  index: item.bountyIndex,
  author: item.author,
  address: item.proposer,
  status: item.state ?? "Unknown",
  time: getPostUpdatedAt(item),
  detailLink: `/treasury/bounty/${item.bountyIndex}`,
  value: item.onchainData?.value,
});

export const toTreasuryChildBountyListItem = (chain, item) => ({
  ...item,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  status: item.state ?? "Unknown",
  time: getPostUpdatedAt(item),
  value: item.onchainData.value,
  detailLink: `/treasury/child-bounty/${item.index}`,
  parentIndex: item.parentBountyId,
});

export const toReferendaListItem = (chain, item) => ({
  ...item,
  title: getTitle(item),
  time: getPostUpdatedAt(item),
  status: item.state ?? "Unknown",
  index: item.referendumIndex,
  author: item.author,
  address: item.proposer,
  detailLink: `/democracy/referendum/${item.referendumIndex}`,
});

export const toTipListItem = (chain, item) => ({
  ...item,
  title: getTitle(item),
  author: item.author,
  address: item.finder,
  status: getTipState(item.state),
  time: getPostUpdatedAt(item),
  detailLink: `/treasury/tip/${item.height}_${item.hash}`,
  value:
    getTipState(item.state) === "Retracted"
      ? null
      : item?.onchainData?.medianValue,
});

export const toPublicProposalListItem = (chain, item) => ({
  ...item,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  index: item.proposalIndex,
  status: item.state ?? "Unknown",
  time: getPostUpdatedAt(item),
  detailLink: `/democracy/proposal/${item.proposalIndex}`,
});

export const toExternalProposalListItem = (chain, item) => ({
  ...item,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  time: getPostUpdatedAt(item),
  hash: item.externalProposalHash,
  status: item.state ?? "Unknown",
  detailLink: `/democracy/external/${item.indexer.blockHeight}_${item.externalProposalHash}`,
});

export const toGov2ReferendaListItem = (item, tracks = []) => {
  const track = tracks.find(
    (trackItem) => trackItem.id === item.onchainData?.track
  );

  return {
    ...item,
    title: getGov2ReferendumTitle(item),
    time: getPostUpdatedAt(item),
    status: item.onchainData?.state?.name ?? "Unknown",
    index: item.referendumIndex,
    author: item.author,
    address: item.proposer,
    detailLink: `/referenda/referendum/${item.referendumIndex}`,
    commentsCount: item.commentsCount,
    trackName: track?.name,
  };
};

export const toFellowshipReferendaListItem = (item, tracks = []) => {
  const track = tracks.find(
    (trackItem) => trackItem.id === item.onchainData.track
  );

  return {
    ...item,
    title: getGov2ReferendumTitle(item),
    time: getPostUpdatedAt(item),
    status: item.onchainData?.state?.name ?? "Unknown",
    index: item.referendumIndex,
    author: item.author,
    address: item.proposer,
    detailLink: `/fellowship/referendum/${item.referendumIndex}`,
    commentsCount: item.commentsCount,
    trackName: track?.name,
  };
};
