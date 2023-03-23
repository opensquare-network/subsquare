import flatten from "lodash.flatten";
import { getMotionId } from "next-common/utils/motion";
import { getTitle } from "next-common/utils/post";
import { getPostLastActivityAt } from "next-common/utils/viewfuncs/postUpdatedTime";

export const convertPolkassemblyReaction = (chain, paReactions) =>
  flatten(
    Object.entries(paReactions || {}).map(([r, { usernames } = {}]) => usernames?.map(u => [r, u]))
  ).map(([r, u]) => ({
    reaction: r === "👍" ? 1 : 0,
    user: u,
  }));

export const convertPolkassemblyComment = (chain, comment) => ({
  reactions: convertPolkassemblyReaction(comment.comment_reactions),
  id: comment.id,
  content: comment.content,
  createdAt: comment.created_at,
  updatedAt: comment.updated_at,
  author: {
    username: comment.username,
    address: comment.proposer,
  },
});

export const toPolkassemblyCommentListItem = (chain, item) => ({
  ...convertPolkassemblyComment(chain, item),
  replies: item.replies?.map((r) => convertPolkassemblyComment(chain, r)),
});

export const toFinancialMotionsListItem = (chain, item) => ({
  ...item,
  index: item.motionIndex,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  status: item.state?.state ?? "Unknown",
  detailLink: `/financial-council/motion/${getMotionId(item)}`,
  time: getPostLastActivityAt(item),
});

export const toAdvisoryMotionsListItem = (chain, item) => ({
  ...item,
  index: item.motionIndex,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  status: item.state ?? "Unknown",
  detailLink: `/advisory-committee/motion/${getMotionId(item)}`,
  time: getPostLastActivityAt(item),
});

export const toTreasuryChildBountyListItem = (chain, item) => ({
  ...item,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  status: item.state ?? "Unknown",
  time: getPostLastActivityAt(item),
  value: item.onchainData.value,
  detailLink: `/treasury/child-bounty/${item.index}`,
  parentIndex: item.parentBountyId,
});
