const { getTipCollection } = require("../index");

async function insertTip(tip) {
  const tipCol = await getTipCollection();
  await tipCol.insertOne(tip);
}

async function getTipByHash(hash) {
  const tipCol = await getTipCollection();
  return await tipCol.findOne({ hash });
}

async function updateTipByHash(hash, updates, timelineItem) {
  const tipCol = await getTipCollection();

  let update = {
    $set: updates,
  };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  await tipCol.updateOne({ hash: hash, isFinal: false }, update);
}

module.exports = {
  getTipByHash,
  updateTipByHash,
  insertTip,
};
