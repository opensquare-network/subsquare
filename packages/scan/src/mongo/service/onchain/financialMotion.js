const { getFinancialMotionCollection } = require("../../index");
const isEmpty = require("lodash.isempty");

async function insertFinancialMotion(motion) {
  const {
    indexer: { blockHeight },
    hash,
  } = motion;

  const motionCol = await getFinancialMotionCollection();
  const maybeInDb = await motionCol.findOne({
    "indexer.blockHeight": blockHeight,
    hash,
  });
  if (maybeInDb) {
    return;
  }

  await motionCol.insertOne(motion);
}

async function updateFinancialMotionByHash(hash, updates, timelineItem) {
  const col = await getFinancialMotionCollection();
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
  insertFinancialMotion,
  updateFinancialMotionByHash,
};
