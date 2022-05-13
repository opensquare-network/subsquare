import { addressEllipsis, stringUpperFirst } from ".";

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

function getTechCommMotionId(motion) {
  if (motion.index !== null && motion.index !== undefined) {
    return motion.index;
  }

  return `${motion.indexer.blockHeight}_${motion.hash}`;
}

export const toTechCommMotionListItem = (chain, item) => ({
  ...item,
  title: item.title,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item?.state ?? "Unknown",
  detailLink: `/techcomm/proposal/${getTechCommMotionId(item)}`,
  time: getPostUpdatedAt(item),
  isDemocracy: item?.onchainData?.publicProposals?.length > 0,
});

export const toTreasuryProposalListItem = (chain, item) => ({
  ...item,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item.state ?? "Unknown",
  time: getPostUpdatedAt(item),
  detailLink: `/treasury/proposal/${item.proposalIndex}`,
  value: item.onchainData.value,
  index: item.proposalIndex,
});

export const toReferendaListItem = (chain, item) => ({
  ...item,
  time: getPostUpdatedAt(item),
  status: item.state ?? "Unknown",
  index: item.referendumIndex,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  detailLink: `/democracy/referendum/${item.referendumIndex}`,
});

export const toPublicProposalListItem = (chain, item) => ({
  ...item,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
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

export const getMetaDesc = (post, type = "Discussion") => {
  let contentDesc = "";
  const maxDescLength = 60;
  if (post.content) {
    if (post.content.length > maxDescLength) {
      contentDesc = post.content.substr(0, maxDescLength) + "...";
    } else {
      contentDesc = post.content;
    }
  }
  return contentDesc;
};
