const { getBusinessTechCommMotionCollection } = require("../../business");
const {
  getMotionPostDefaultTitle,
} = require("../../../business/common/collective/utils");

async function insertTechCommMotionPost(indexer, hash, motionIndex, proposer) {
  const col = await getBusinessTechCommMotionCollection();
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
    title: getMotionPostDefaultTitle(hash, motionIndex),
    content: "",
    contentType: "markdown",
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
  });
}

module.exports = {
  insertTechCommMotionPost,
};
