const { getDemocracyPublicProposalCollection } = require("../../index");

async function insertProposal(proposalObj) {
  const col = await getDemocracyPublicProposalCollection();
  const { proposalIndex } = proposalObj;
  const maybeInDb = await col.findOne({ proposalIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(proposalObj);
}

module.exports = {
  insertDemocracyPublicProposal: insertProposal,
};
