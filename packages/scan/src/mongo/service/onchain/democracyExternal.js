const { getDemocracyExternalCollection } = require("../../index");
const isEmpty = require("lodash.isempty");

async function insertExternal(externalObj) {
  const col = await getDemocracyExternalCollection();
  const { proposalHash } = externalObj;
  const maybeInDb = await col.findOne({ proposalHash, isFinal: false });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(externalObj);
}

function extractUpdate(updates, timelineItem, techCommMotion) {
  let update = isEmpty(updates) ? null : { $set: updates };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  if (techCommMotion) {
    update = {
      ...update,
      $push: { techCommMotions: techCommMotion },
    };
  }

  return update;
}

async function updateExternalByHash(
  proposalHash,
  updates,
  timelineItem,
  techCommMotion
) {
  if (isEmpty(updates) && isEmpty(timelineItem) && isEmpty(techCommMotion)) {
    return;
  }

  const update = extractUpdate(updates, timelineItem, techCommMotion);
  const col = await getDemocracyExternalCollection();
  await col.updateOne({ proposalHash, isFinal: false }, update);
}

async function getUnFinishedExternal(hash) {
  const col = await getDemocracyExternalCollection();
  return col.findOne({ proposalHash: hash, isFinal: false });
}

async function finishExternalByHash(hash) {
  const col = await getDemocracyExternalCollection();
  await col.updateOne(
    { proposalHash: hash, isFinal: false },
    {
      $set: { isFinal: true },
    }
  );
}

module.exports = {
  insertDemocracyExternal: insertExternal,
  updateDemocracyExternalByHash: updateExternalByHash,
  getDemocracyExternalUnFinished: getUnFinishedExternal,
  finishExternalByHash,
};
