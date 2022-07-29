import getMotionId from "next-common/utils/collective/motionId";

export function getPostUpdatedAt(post) {
  if (post.createdAt === post.lastActivityAt) {
    return post?.indexer?.blockTime ?? post.createdAt;
  }
  return post.lastActivityAt;
}

export const toDiscussionListItem = (chain, item) => ({
  ...item,
  time: item.lastActivityAt,
  detailLink: `/post/${item.postUid}`,
});

export const toTechCommMotionListItem = (chain, item) => ({
  ...item,
  title: item.title,
  author: item.author,
  address: item.proposer,
  status: item?.state ?? "Unknown",
  detailLink: `/techcomm/proposal/${getMotionId(item)}`,
  time: getPostUpdatedAt(item),
  isDemocracy: item?.onchainData?.publicProposals?.length > 0,
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

export const toReferendaListItem = (chain, item) => ({
  ...item,
  time: getPostUpdatedAt(item),
  status: item.state ?? "Unknown",
  index: item.referendumIndex,
  author: item.author,
  address: item.proposer,
  detailLink: `/democracy/referendum/${item.referendumIndex}`,
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

export function toApiType(type) {
  if (type === "treasury/bounty") {
    return "treasury/bounties";
  }
  return `${type}s`;
}
