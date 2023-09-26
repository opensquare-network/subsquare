import flatten from "lodash.flatten";
import { encodeAddressToChain } from "next-common/services/address";
import { addressEllipsis } from "next-common/utils";
import { getMotionId } from "next-common/utils/motion";
import { getTitle } from "next-common/utils/post";
import {
  advisoryCommitteeBaseUrl,
  childBountyBaseUrl,
} from "next-common/utils/postBaseUrl";
import { getPostLastActivityAt } from "next-common/utils/viewfuncs/postUpdatedTime";

export const convertPolkassemblyReaction = (paReactions) => {
  const flattened = flatten(
    Object.entries(paReactions || {}).map(([r, { usernames } = {}]) =>
      usernames?.map((u) => [r, u]),
    ),
  );
  const reactions = flattened.map(([r, u]) => ({
    reaction: r === "👍" ? 1 : 0,
    user: u,
  }));

  return reactions;
};

export const convertPolkassemblyComment = (chain, comment) => {
  const address =
    comment.proposer && encodeAddressToChain(comment.proposer, chain);
  return {
    reactions: convertPolkassemblyReaction(comment.comment_reactions),
    id: comment.id,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    author: {
      username: comment.is_custom_username
        ? comment.username
        : address
        ? addressEllipsis(address)
        : comment.username,
      address,
      polkassemblyUserLink: `https://${chain}.polkassembly.io/user/${comment.username}`,
    },
  };
};

export const toPolkassemblyCommentListItem = (chain, item) => ({
  ...convertPolkassemblyComment(chain, item),
  replies: item.replies?.map((r) => convertPolkassemblyComment(chain, r)),
});

export const toFinancialMotionsListItem = (item) => {
  return {
    ...item,
    index: item.motionIndex,
    title: getTitle(item),
    author: item.author,
    address: item.proposer,
    status: item.state ?? "Unknown",
    detailLink: `/financial-council/motions/${getMotionId(item)}`,
    time: getPostLastActivityAt(item),
  };
};

export const toAdvisoryMotionsListItem = (item) => ({
  ...item,
  index: item.motionIndex,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  status: item.state ?? "Unknown",
  detailLink: `${advisoryCommitteeBaseUrl}/${getMotionId(item)}`,
  time: getPostLastActivityAt(item),
});

export const toTreasuryChildBountyListItem = (item) => ({
  ...item,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  status: item.state ?? "Unknown",
  time: getPostLastActivityAt(item),
  value: item.onchainData.value,
  detailLink: `${childBountyBaseUrl}/${item.index}`,
  parentIndex: item.parentBountyId,
});
