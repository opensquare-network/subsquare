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

  const blockTime = new Date(indexer.blockTime);
  await col.insertOne({
    height: indexer.blockHeight,
    indexer,
    hash,
    motionIndex,
    proposer,
    title: getMotionPostDefaultTitle(hash, motionIndex),
    content: "",
    contentType: "markdown",
    createdAt: blockTime,
    updatedAt: blockTime,
    lastActivityAt: blockTime,
  });
}

module.exports = {
  insertMotionPost,
};
