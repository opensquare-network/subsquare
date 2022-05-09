import { addressEllipsis } from ".";

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

export const toCouncilMotionListItem = (chain, item) => ({
  ...item,
  index: item.motionIndex,
  title: `${item?.title}`,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item.state ?? "Unknown",
  detailLink: `/council/motion/${item.indexer.blockHeight}_${item.hash}`,
  isTreasury:
    item?.onchainData?.treasuryProposals?.length > 0 ||
    item?.onchainData?.treasuryBounties?.length > 0,
  isDemocracy: item?.onchainData?.externalProposals?.length > 0,
  time: getPostUpdatedAt(item),
});

export const toFinancialMotionsListItem = (chain, item) => ({
  ...item,
  index: item.motionIndex,
  title: `${item?.title}`,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item.state ?? "Unknown",
  detailLink: `/financial-council/motion/${item.indexer.blockHeight}_${item.hash}`,
  time: getPostUpdatedAt(item),
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
  isDemocracy: item?.onchainData?.externalProposals?.length > 0,
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
});

export const toTreasuryBountyListItem = (chain, item) => ({
  ...item,
  index: item.bountyIndex,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item.state ?? "Unknown",
  time: getPostUpdatedAt(item),
  detailLink: `/treasury/bounty/${item.bountyIndex}`,
  value: item.onchainData.value,
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

export const toTipListItem = (chain, item) => ({
  ...item,
  author: item.author ?? {
    username: addressEllipsis(item.finder),
    addresses: [{ chain, address: item.finder }],
  },
  status: item.state ? getTipState(item.state) : "Unknown",
  time: getPostUpdatedAt(item),
  detailLink: `/treasury/tip/${item.height}_${item.hash}`,
  value: item?.onchainData?.medianValue,
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

export const toExternalProposalListItem = (chain, item) => ({
  ...item,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  time: getPostUpdatedAt(item),
  hash: item.externalProposalHash,
  status: item.state ?? "Unknown",
  detailLink: `/democracy/external/${item.indexer.blockHeight}_${item.externalProposalHash}`,
});

export function toApiType(type) {
  if (type === "treasury/bounty") {
    return "treasury/bounties";
  }
  return `${type}s`;
}

export const isMotionCompleted = (motion) => {
  if (motion?.state?.state !== "Executed") {
    return false;
  }
  if (!motion.proposalHash) {
    return false;
  }
  const ok = motion.state.data.some((data) =>
    Object.keys(data).some((rawData) => rawData === "ok")
  );
  if (!ok) {
    return false;
  }
  const error = motion.state.data.some((data) =>
    Object.keys(data).some((rawData) => rawData === "error")
  );
  return !error;
};

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
