const { getBusinessTreasuryProposalCollection } = require("../../business");

async function insertProposalPost(proposal) {
  const col = await getBusinessTreasuryProposalCollection();
  const maybeInDb = await col.findOne({ proposalIndex: proposal.proposalIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne({
    indexer: proposal.indexer,
    proposalIndex: proposal.proposalIndex,
    proposer: proposal.proposer,
    title: `Untitled - treasury proposal #${proposal.proposalIndex}`,
    content: "",
    contentType: "markdown",
    createdAt: indexer.blockTime,
    updatedAt: indexer.blockTime,
    lastActivityAt: indexer.blockTime,
  });
}

module.exports = {
  insertTreasuryProposalPost: insertProposalPost,
};
