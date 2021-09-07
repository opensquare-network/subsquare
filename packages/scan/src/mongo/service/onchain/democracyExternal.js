const { getDemocracyExternalCollection } = require("../../index");

async function insertExternal(externalObj) {
  const col = await getDemocracyExternalCollection();
  const { proposalHash } = externalObj;
  const maybeInDb = await col.findOne({ proposalHash });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(externalObj);
}

async function updateExternalByHash(proposalHash, updates, timelineItem) {
  let update = {
    $set: updates,
  };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  const col = await getDemocracyExternalCollection();
  await col.updateOne({ proposalHash }, update);
}

module.exports = {
  insertExternal,
  updateExternalByHash,
};
