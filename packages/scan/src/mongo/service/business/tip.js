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

  const now = new Date();
  await col.insertOne({
    height: indexer.blockHeight,
    indexer,
    hash,
    title: reason,
    content: "",
    contentType: "markdown",
    contentVersion: "2",
    finder,
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
  });
}

module.exports = {
  insertTipPost,
};
