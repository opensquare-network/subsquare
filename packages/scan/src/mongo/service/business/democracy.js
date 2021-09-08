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

async function insertDemocracyPostByExternal(externalProposalHash) {
  const col = await getBusinessDemocracy();
  const maybeInDb = await col.findOne({ externalProposalHash });
  if (maybeInDb) {
    return;
  }

  await col.insertOne({ externalProposalHash });
}

module.exports = {
  insertDemocracyPostByProposal,
  updateOrCreatePostByReferendumWithProposal,
  insertDemocracyPostByExternal,
};
