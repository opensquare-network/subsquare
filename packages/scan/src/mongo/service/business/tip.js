const { getBusinessTipCollection } = require("../../business");

async function insertTipPost(indexer, hash, reason, finder, state) {
  const col = await getBusinessTipCollection();
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
    finder,
    reason,
    state,
  });
}

module.exports = {
  insertTipPost,
};
