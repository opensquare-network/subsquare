const { getBusinessDemocracy } = require("../../business");

/**
 *
 * @param proposalIndex
 * @returns {Promise<void>}
 */
async function insertDemocracyPostByProposal(proposalIndex) {
  const col = await getBusinessDemocracy();
  const maybeInDb = await col.findOne({
    proposalIndex: proposalIndex,
  });
  if (maybeInDb) {
    return;
  }

  await col.insertOne({ proposalIndex });
}

async function updateOrCreatePostByReferendumWithProposal(
  proposalIndex,
  referendumIndex
) {
  const col = await getBusinessDemocracy();
  const maybeInDb = await col.findOne({
    proposalIndex: proposalIndex,
  });
  if (maybeInDb) {
    await col.insertOne({
      proposalIndex,
      referendumIndex,
    });

    return;
  }

  await col.updateOne(
    { proposalIndex },
    {
      $set: { referendumIndex },
    }
  );
}

module.exports = {
  insertDemocracyPostByProposal,
  updateOrCreatePostByReferendumWithProposal,
};
