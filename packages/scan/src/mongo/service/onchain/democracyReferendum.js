const { getDemocracyReferendumCollection } = require("../../index");

async function insertReferendum(referendumObj) {
  const col = await getDemocracyReferendumCollection();
  const { referendumIndex } = referendumObj;
  const maybeInDb = await col.findOne({ referendumIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(referendumObj);
}

async function updateReferendumByIndex(referendumIndex, updates, timelineItem) {
  let update = {
    $set: updates,
  };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  const col = await getDemocracyReferendumCollection();
  await col.updateOne({ referendumIndex }, update);
}

module.exports = {
  insertDemocracyReferendum: insertReferendum,
  updateDemocracyReferendum: updateReferendumByIndex,
};
