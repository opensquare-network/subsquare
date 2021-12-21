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

  const blockTime = new Date(indexer.blockTime);
  await col.insertOne({
    height: indexer.blockHeight,
    indexer,
    hash,
    title: reason,
    content: "",
    contentType: "markdown",
    finder,
    createdAt: blockTime,
    updatedAt: blockTime,
    lastActivityAt: blockTime,
  });
}

module.exports = {
  insertTipPost,
};
