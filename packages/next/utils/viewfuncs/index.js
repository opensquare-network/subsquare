import { addressEllipsis } from "next-common/utils";
import { getMotionId } from "next-common/utils/motion";
import { getTitle } from "next-common/utils/post";
import { getPostLastActivityAt } from "next-common/utils/viewfuncs/postUpdatedTime";

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
