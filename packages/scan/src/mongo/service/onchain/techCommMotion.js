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

async function updateMotionByHash(hash, updates, timelineItem) {
  const col = await getTechCommMotionCollection();

  let update = {
    $set: updates,
  };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  await col.updateOne({ hash: hash, isFinal: false }, update);
}

module.exports = {
  insertTechCommMotion: insertMotion,
  updateTechCommMotionByHash: updateMotionByHash,
};
