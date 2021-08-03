const { getBusinessMotionCollection } = require("../../business");

async function insertMotionPost(
  indexer,
  hash,
  proposer,
  proposal,
  voting,
  state
) {
  const col = await getBusinessMotionCollection();
  const maybeInDb = await col.findOne({
    "indexer.blockHeight": indexer.blockHeight,
    hash,
  });
  if (maybeInDb) {
    return;
  }

  await col.insertOne({
    height: indexer.blockHeight,
    indexer,
    hash,
    proposer,
    proposal,
    voting,
    state,
    isFinal: false,
  });
}

module.exports = {
  insertMotionPost,
};
