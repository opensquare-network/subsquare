const { getDemocracyExternalCollection } = require("../../index");

async function insertExternal(externalObj) {
  const col = await getDemocracyExternalCollection();
  const { proposalHash } = externalObj;
  const maybeInDb = await col.findOne({ proposalHash, isFinal: false });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(externalObj);
}

function extractUpdate(updates, timelineItem) {
  let update = {
    $set: updates,
  };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  return update;
}

async function updateExternalByHash(proposalHash, updates, timelineItem) {
  const update = extractUpdate(updates, timelineItem);

  const col = await getDemocracyExternalCollection();
  await col.updateOne({ proposalHash, isFinal: false }, update);
}

module.exports = {
  insertDemocracyExternal: insertExternal,
  updateDemocracyExternalByHash: updateExternalByHash,
};
