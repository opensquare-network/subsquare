// Only for Karura/Acala
const { getBusinessFinancialMotionCollection } = require("../../business");
const isNil = require("lodash.isnil");

function getMotionPostDefaultTitle(hash, motionIndex) {
  if (isNil(motionIndex)) {
    const prefix = hash.slice(0, 6);
    const length = hash.length;
    const suffix = hash.slice(length - 4, length);
    return `Untitled - financial motion ${prefix}...${suffix}`;
  }

  return `Untitled - financial motion #${motionIndex}`;
}

async function insertFinancialMotionPost(indexer, hash, motionIndex, proposer) {
  const col = await getBusinessFinancialMotionCollection();
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
  insertFinancialMotionPost,
};
