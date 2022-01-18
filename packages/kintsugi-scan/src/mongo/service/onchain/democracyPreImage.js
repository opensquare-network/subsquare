const { getDemocracyPreImageCollection } = require("../../index");
const isEmpty = require("lodash.isempty");

async function insertPreImage(imageInfo) {
  const { hash } = imageInfo;

  const col = await getDemocracyPreImageCollection();
  const maybeInDb = await col.findOne({ hash });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(imageInfo);
}

async function updatePreImage(hash, updates) {
  if (isEmpty(updates)) {
    return;
  }

  const col = await getDemocracyPreImageCollection();
  let update = { $set: updates };
  await col.updateOne({ hash: hash }, update);
}

module.exports = {
  insertPreImage,
  updatePreImage,
};
