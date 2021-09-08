const { getTechCommMotionCollection } = require("../../index");

async function insertMotion(motion) {
  const {
    indexer: { blockHeight },
    hash,
  } = motion;

  const motionCol = await getTechCommMotionCollection();
  const maybeInDb = await motionCol.findOne({
    "indexer.blockHeight": blockHeight,
    hash,
  });
  if (maybeInDb) {
    return;
  }

  await motionCol.insertOne(motion);
}

module.exports = {
  insertTechCommMotion: insertMotion,
};
