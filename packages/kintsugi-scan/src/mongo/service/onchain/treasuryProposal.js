const { getTreasuryProposalCollection } = require("../../index");
const isEmpty = require("lodash.isempty");

async function insertProposal(proposalObj) {
  const col = await getTreasuryProposalCollection();
  const { proposalIndex } = proposalObj;
  const maybeInDb = await col.findOne({ proposalIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(proposalObj);
}

async function updateProposal(
  proposalIndex,
  updates,
  timelineItem,
  publicProposalInfo
) {
  const col = await getTreasuryProposalCollection();
  let update = isEmpty(updates) ? null : { $set: updates };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  if (publicProposalInfo) {
    update = {
      ...update,
      $push: { publicProposals: publicProposalInfo },
    };
  }

  if (isEmpty(update)) {
    return;
  }

  await col.updateOne({ proposalIndex }, update);
}

module.exports = {
  insertTreasuryProposal: insertProposal,
  updateTreasuryProposal: updateProposal,
};
