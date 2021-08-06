const { getBusinessMotionCollection } = require("../../business");

async function insertMotionPost(indexer, hash) {
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
  });
}

module.exports = {
  insertMotionPost,
};
