const {
  getMotionPostDefaultTitle,
} = require("../../../business/common/collective/utils");
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

  await col.insertOne({
    height: indexer.blockHeight,
    indexer,
    hash,
    motionIndex,
    proposer,
    title: getMotionPostDefaultTitle(hash, motionIndex),
    content: "",
    contentType: "markdown",
    createdAt: indexer.blockTime,
    updatedAt: indexer.blockTime,
    lastActivityAt: indexer.blockTime,
  });
}

module.exports = {
  insertMotionPost,
};
