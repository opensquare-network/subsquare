const { getBusinessTreasuryProposalCollection } = require("../../business");

async function insertProposalPost(proposalIndex) {
  const col = await getBusinessTreasuryProposalCollection();
  const maybeInDb = await col.findOne({ proposalIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne({
    proposalIndex,
  });
}

module.exports = {
  insertTreasuryProposalPost: insertProposalPost,
};
