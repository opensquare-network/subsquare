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

async function updateProposalByIndex(proposalIndex, updates, timelineItem) {
  let update = {
    $set: updates,
  };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  const col = await getDemocracyPublicProposalCollection();
  await col.updateOne({ proposalIndex }, update);
}

module.exports = {
  insertDemocracyPublicProposal: insertProposal,
  updateDemocracyPublicProposal: updateProposalByIndex,
};
