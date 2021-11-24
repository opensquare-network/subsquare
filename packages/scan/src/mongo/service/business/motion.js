const { getBusinessMotionCollection } = require("../../business");

async function insertMotionPost(indexer, hash, motionIndex, proposer) {
  const col = await getBusinessMotionCollection();
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
    motionIndex,
    proposer,
    title: `Untitled - motion #${motionIndex}`,
    content: "",
    contentType: "markdown",
    contentVersion: "2",
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
  });
}

module.exports = {
  insertMotionPost,
};
