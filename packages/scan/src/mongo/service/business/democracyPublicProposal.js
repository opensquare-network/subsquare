const { getBusinessDemocracyPublicProposalCol } = require("../../business");

async function insertProposalPost(proposal) {
  const col = await getBusinessDemocracyPublicProposalCol();
  const maybeInDb = await col.findOne({
    proposalIndex: proposal.proposalIndex,
  });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(proposal);
}

module.exports = {
  insertDemocracyPublicProposalPost: insertProposalPost,
};
