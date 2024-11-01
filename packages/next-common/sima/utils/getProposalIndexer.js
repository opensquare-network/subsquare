import { isNil } from "lodash-es";

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

export function getTreasurySpendIndexer(post) {
  return {
    pallet: "treasury",
    object: "spends",
    proposed_height: post.indexer.blockHeight,
    id: post.index,
  };
}

export function getMotionProposalIndexer(post) {
  return {
    pallet: "council",
    object: "proposalOf",
    proposed_height: post.indexer.blockHeight,
    id: post.hash,
  };
}

export function getDemocracyExternalIndexer(post) {
  return {
    pallet: "democracy",
    object: "externalProposal",
    proposed_height: post.indexer.blockHeight,
    id: post.externalProposalHash,
  };
}

export function getDemocracyPublicIndexer(post) {
  return {
    pallet: "democracy",
    object: "publicProposal",
    proposed_height: post.indexer.blockHeight,
    id: post.proposalIndex,
  };
}

export function getDemocracyReferendumIndexer(post) {
  return {
    pallet: "democracy",
    object: "referendumInfoOf",
    proposed_height: post.indexer.blockHeight,
    id: post.referendumIndex,
  };
}

export function getTechCommMotionIndexer(post) {
  return {
    pallet: "technicalCommittee",
    object: "proposalOf",
    proposed_height: post.indexer.blockHeight,
    id: post.hash,
  };
}

export default function getProposalIndexer(post) {
  const refToPost = post.refToPost;
  const type = refToPost?.postType;
  if (type === "referendaReferendum") {
    return getReferendaProposalIndexer(refToPost);
  } else if (type === "treasuryProposal") {
    return getTreasuryProposalIndexer(refToPost);
  } else if (type === "treasurySpend") {
    return getTreasurySpendIndexer(refToPost);
  } else if (type === "motion") {
    return getMotionProposalIndexer(refToPost);
  } else if (type === "techCommMotion") {
    return getTechCommMotionIndexer(refToPost);
  } else if (type === "democracy") {
    if (refToPost?.externalProposalHash) {
      return getDemocracyExternalIndexer(refToPost);
    } else if (!isNil(refToPost?.proposalIndex)) {
      return getDemocracyPublicIndexer(refToPost);
    } else if (!isNil(refToPost?.referendumIndex)) {
      return getDemocracyReferendumIndexer(refToPost);
    }
  }
  throw new Error(`Invalid post type for getProposalIndexer: ${type}`);
}
