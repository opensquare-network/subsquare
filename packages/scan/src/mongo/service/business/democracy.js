const { getBusinessDemocracy } = require("../../business");

/**
 *
 * @param proposalIndex
 * @param indexer: start point
 * @returns {Promise<void>}
 */
async function insertDemocracyPostByProposal(proposalIndex, indexer) {
  const col = await getBusinessDemocracy();
  const maybeInDb = await col.findOne({
    proposalIndex: proposalIndex,
  });
  if (maybeInDb) {
    return;
  }

  await col.insertOne({ proposalIndex });
}

module.exports = {
  insertDemocracyPostByProposal,
};
