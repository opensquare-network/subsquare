const { getBusinessTreasuryProposalCollection } = require("../../business");

async function insertProposalPost(proposal) {
  const col = await getBusinessTreasuryProposalCollection();
  const maybeInDb = await col.findOne({
    proposalIndex: proposal.proposalIndex,
  });
  if (maybeInDb) {
    return;
  }

  const blockTime = new Date(proposal.indexer.blockTime);
  await col.insertOne({
    indexer: proposal.indexer,
    proposalIndex: proposal.proposalIndex,
    proposer: proposal.proposer,
    title: `Untitled - treasury proposal #${proposal.proposalIndex}`,
    content: "",
    contentType: "markdown",
    createdAt: blockTime,
    updatedAt: blockTime,
    lastActivityAt: blockTime,
  });
}

module.exports = {
  insertTreasuryProposalPost: insertProposalPost,
};
