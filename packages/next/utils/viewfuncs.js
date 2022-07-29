import Chains from "next-common/utils/consts/chains";
import { addressEllipsis } from "next-common/utils";
import { getMotionId } from "next-common/utils/motion";

const TipStateMap = {
  NewTip: "Tipping",
  tip: "Tipping",
  Tipping: "Tipping",
  TipRetracted: "Retracted",
  TipClosed: "Closed",
};

export function getPostUpdatedAt(post) {
  if (post.createdAt === post.lastActivityAt) {
    return post?.indexer?.blockTime ?? post.createdAt;
  }
  return post.lastActivityAt;
}

export function getTipState(state) {
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
        addresses: [
          {
            address: paUser?.[`${chain}_default_address`],
            chain,
          },
        ],
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

export const toPolkassemblyDiscussionListItem = (chain, item) => ({
  ...item,
  time: item.lastActivityAt,
  author: {
    ...item.author,
    ...(item.author.address
      ? {
          addresses: [
            {
              address: item.author.address,
              chain,
            },
          ],
        }
      : {}),
  },
  detailLink: `/polkassembly/post/${item.polkassemblyId}`,
});

export const toPolkassemblyCommentListItem = (chain, item) => ({
  ...convertPolkassemblyComment(chain, item),
  replies: item.replies?.map((r) => convertPolkassemblyComment(chain, r)),
});

export const toCouncilMotionListItem = (chain, item) => {
  let motionId = `${item.indexer.blockHeight}_${item.hash}`;
  if (Chains.kusama === chain) {
    motionId = item.motionIndex;
  }

  return {
    ...item,
    index: item.motionIndex,
    title: `${item?.title}`,
    author: item.author,
    address: item.proposer,
    status: item.state ?? "Unknown",
    detailLink: `/council/motion/${motionId}`,
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
  title: `${item?.title}`,
  author: item.author,
  address: item.proposer,
  status: item.state ?? "Unknown",
  detailLink: `/financial-council/motion/${item.indexer.blockHeight}_${item.hash}`,
  time: getPostUpdatedAt(item),
});

export const toTechCommMotionListItem = (chain, item) => ({
  ...item,
  title: item.title,
  author: item.author,
  address: item.proposer,
  status: item?.state ?? "Unknown",
  detailLink: `/techcomm/proposal/${getMotionId(item)}`,
  time: getPostUpdatedAt(item),
  isDemocracy: item?.onchainData?.externalProposals?.length > 0,
});

export const toTreasuryProposalListItem = (chain, item) => ({
  ...item,
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
  index: item.bountyIndex,
  author: item.author,
  address: item.proposer,
  status: item.state ?? "Unknown",
  time: getPostUpdatedAt(item),
  detailLink: `/treasury/bounty/${item.bountyIndex}`,
  value: item.onchainData.value,
});

export const toTreasuryChildBountyListItem = (chain, item) => ({
  ...item,
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
  time: getPostUpdatedAt(item),
  status: item.state ?? "Unknown",
  index: item.referendumIndex,
  author: item.author,
  address: item.proposer,
  detailLink: `/democracy/referendum/${item.referendumIndex}`,
});

export const toTipListItem = (chain, item) => ({
  ...item,
  author: item.author,
  address: item.finder,
  status: item.state ? getTipState(item.state) : "Unknown",
  time: getPostUpdatedAt(item),
  detailLink: `/treasury/tip/${item.height}_${item.hash}`,
  value: item?.onchainData?.medianValue,
});

export const toPublicProposalListItem = (chain, item) => ({
  ...item,
  author: item.author,
  address: item.proposer,
  index: item.proposalIndex,
  status: item.state ?? "Unknown",
  time: getPostUpdatedAt(item),
  detailLink: `/democracy/proposal/${item.proposalIndex}`,
});

export const toExternalProposalListItem = (chain, item) => ({
  ...item,
  author: item.author,
  address: item.proposer,
  time: getPostUpdatedAt(item),
  hash: item.externalProposalHash,
  status: item.state ?? "Unknown",
  detailLink: `/democracy/external/${item.indexer.blockHeight}_${item.externalProposalHash}`,
});
