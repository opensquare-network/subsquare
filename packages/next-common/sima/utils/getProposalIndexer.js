export default function getReferendaProposalIndexer(post) {
  return {
    pallet: "referenda",
    object: "referendumInfoFor",
    proposed_height: post.indexer.blockHeight,
    id: post.referendumIndex,
  };
}
