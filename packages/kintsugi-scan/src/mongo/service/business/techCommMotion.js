const { getBusinessTechCommMotionCollection } = require("../../business");
const {
  business: { getMotionPostDefaultTitle },
} = require("@subsquare/scan-common");

async function insertTechCommMotionPost(indexer, hash, motionIndex, proposer) {
  const col = await getBusinessTechCommMotionCollection();
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
  insertTechCommMotionPost,
};
