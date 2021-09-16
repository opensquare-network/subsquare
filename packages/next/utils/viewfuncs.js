import { addressEllipsis } from ".";

function getMotionType(motion) {
  return motion.isTreasury ? "Treasury" : "";
}

export const toDiscussionListItem = (chain, item) => ({
  ...item,
  time: item.lastActivityAt,
  detailLink: `/${chain}/post/${item.postUid}`,
});

export const toCouncilMotionListItem = (chain, item) => ({
  ...item,
  time: item.indexer.blockTime,
  title: `${item.proposal.section}.${item.proposal.method}`,
  type: getMotionType(item),
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item.state?.state ?? "Unknown",
  detailLink: `/${chain}/council/motion/${item.index}`,
});

export const toTechCommMotionListItem = (chain, item) => ({
  ...item,
  time: item.indexer.blockTime,
  title: `${item.proposal.section}.${item.proposal.method}`,
  type: getMotionType(item),
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item.state?.state ?? "Unknown",
  detailLink: `/${chain}/techcomm/proposal/${item.proposalIndex}`,
});

export const toTreasuryProposalListItem = (chain, item) => ({
  ...item,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item.state ?? "Unknown",
  time: item.indexer.blockTime,
  detailLink: `/${chain}/treasury/proposal/${item.proposalIndex}`,
});

export const toReferendaListItem = (chain, item) => ({
  ...item,
  status: item.state,
  index: item.referendumIndex,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  detailLink: `/${chain}/democracy/referendum/${item.referendumIndex}`,
});

export const toTipListItem = (chain, item) => ({
  ...item,
  author: item.author ?? {
    username: addressEllipsis(item.finder),
    addresses: [{ chain, address: item.finder }],
  },
  status: item.state
    ? item.state.state === "Tipping"
      ? `Tipping (${item.state.tipsCount})`
      : item.state.state
    : "Unknown",
  time: item.indexer.blockTime,
  detailLink: `/${chain}/treasury/tip/${item.height}_${item.hash}`,
});

export const toPublicProposalListItem = (chain, item) => ({
  ...item,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item.state ?? "Unknown",
  time: item.indexer.blockTime,
  detailLink: `/${chain}/democracy/proposal/${item.proposalIndex}`,
});

export const toExternalProposalListItem = (chain, item) => ({
  ...item,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  hash: item.externalProposalHash,
  status: item.state ?? "Unknown",
  detailLink: `/${chain}/democracy/external/${item.externalProposalHash}`,
});
