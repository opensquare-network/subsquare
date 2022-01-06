const { getTechCommMotionCollection } = require("../../index");
const isEmpty = require("lodash.isempty");

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
  let update = isEmpty(updates) ? null : { $set: updates };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  if (isEmpty(update)) {
    return;
  }

  await col.updateOne({ hash: hash, isFinal: false }, update);
}

module.exports = {
  insertTechCommMotion: insertMotion,
  updateTechCommMotionByHash: updateMotionByHash,
};
