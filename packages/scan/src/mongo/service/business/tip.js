const { getBusinessTipCollection } = require("../../business");

async function insertTipPost(indexer, hash, reason, finder) {
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
    title: reason,
    content: "",
    contentType: "markdown",
    finder,
    createdAt: indexer.blockTime,
    updatedAt: indexer.blockTime,
    lastActivityAt: indexer.blockTime,
  });
}

module.exports = {
  insertTipPost,
};
