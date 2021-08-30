const { getTreasuryProposalCollection } = require("../index");

async function insertProposal(proposalObj) {
  const col = await getTreasuryProposalCollection();
  const { proposalIndex } = proposalObj;
  const maybeInDb = await col.findOne({ proposalIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(proposalObj);
}

module.exports = {
  insertTreasuryProposal: insertProposal,
};
