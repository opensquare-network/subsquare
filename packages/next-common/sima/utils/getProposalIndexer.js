export function getReferendaProposalIndexer(post) {
  return {
    pallet: "referenda",
    object: "referendumInfoFor",
    proposed_height: post.indexer.blockHeight,
    id: post.referendumIndex,
  };
}

export function getTreasuryProposalIndexer(post) {
  return {
    pallet: "treasury",
    object: "proposals",
    proposed_height: post.indexer.blockHeight,
    id: post.proposalIndex,
  };
}

export default function getProposalIndexer(post) {
  const type = post.refToPost?.postType;
  if (type === "referendaReferendum") {
    return getReferendaProposalIndexer(post.refToPost);
  } else if (type === "treasuryProposal") {
    return getTreasuryProposalIndexer(post.refToPost);
  }
  throw new Error(`Invalid post type for getProposalIndexer: ${type}`);
}
