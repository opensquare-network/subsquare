const { getBusinessDemocracy } = require("../../business");

/**
 *
 * @param proposalIndex
 * @returns {Promise<void>}
 */
async function insertDemocracyPostByProposal(proposalIndex, indexer, proposer) {
  const col = await getBusinessDemocracy();
  const maybeInDb = await col.findOne({
    proposalIndex: proposalIndex,
  });
  if (maybeInDb) {
    return;
  }

  const now = new Date();
  await col.insertOne({
    proposalIndex,
    indexer,
    proposer,
    title: `Untitled - public proposal #${proposalIndex}`,
    content: "",
    contentType: "markdown",
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
  });
}

async function updateOrCreatePostByReferendumWithProposal(
  proposalIndex,
  referendumIndex
) {
  const col = await getBusinessDemocracy();
  const maybeInDb = await col.findOne({
    proposalIndex: proposalIndex,
  });
  if (!maybeInDb) {
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

  const now = new Date();
  await col.insertOne({
    externalProposalHash,
    title: `Untitled - external proposal ${externalProposalHash}`,
    content: "",
    contentType: "markdown",
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
  });
}

async function updateOrCreatePostByReferendumWithExternal(
  externalProposalHash,
  referendumIndex
) {
  const col = await getBusinessDemocracy();
  const maybeInDb = await col.findOne({ externalProposalHash });
  if (!maybeInDb) {
    await col.insertOne({
      externalProposalHash,
      referendumIndex,
    });

    return;
  }

  await col.updateOne(
    { externalProposalHash },
    {
      $set: { referendumIndex },
    }
  );
}

// Will executed when previous public or external proposal not detected
async function insertReferendumPostSolo(referendumIndex) {
  const col = await getBusinessDemocracy();
  const maybeInDb = await col.findOne({ referendumIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne({ referendumIndex });
}

module.exports = {
  insertDemocracyPostByProposal,
  updateOrCreatePostByReferendumWithProposal,
  insertDemocracyPostByExternal,
  insertReferendumPostSolo,
  updateOrCreatePostByReferendumWithExternal,
};
