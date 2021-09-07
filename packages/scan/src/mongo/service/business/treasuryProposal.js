const { getBusinessTreasuryProposalCollection } = require("../../business");

async function insertProposalPost(proposal) {
  const col = await getBusinessTreasuryProposalCollection();
  const maybeInDb = await col.findOne({ proposalIndex: proposal.proposalIndex });
  if (maybeInDb) {
    return;
  }

  const now = new Date();
  await col.insertOne({
    indexer: proposal.indexer,
    proposalIndex: proposal.proposalIndex,
    proposer: proposal.proposer,
    title: `Untitled - treasury proposal #${proposal.proposalIndex}`,
    content: "",
    contentType: "markdown",
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
  });
}

module.exports = {
  insertTreasuryProposalPost: insertProposalPost,
};
