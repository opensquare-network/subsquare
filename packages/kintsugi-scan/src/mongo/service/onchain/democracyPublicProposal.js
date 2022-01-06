const { getDemocracyPublicProposalCollection } = require("../../index");
const isEmpty = require("lodash.isempty");

async function insertProposal(proposalObj) {
  const col = await getDemocracyPublicProposalCollection();
  const { proposalIndex } = proposalObj;
  const maybeInDb = await col.findOne({ proposalIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(proposalObj);
}

async function updateProposalByIndex(
  proposalIndex,
  updates,
  timelineItem,
  techCommMotion
) {
  let update = isEmpty(updates) ? null : { $set: updates };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  if (techCommMotion) {
    update = {
      ...update,
      $push: { techCommMotions: techCommMotion },
    };
  }

  if (isEmpty(update)) {
    return;
  }

  const col = await getDemocracyPublicProposalCollection();
  await col.updateOne({ proposalIndex }, update);
}

module.exports = {
  insertDemocracyPublicProposal: insertProposal,
  updateDemocracyPublicProposal: updateProposalByIndex,
};
