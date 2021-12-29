const { getDemocracyPreImageCollection } = require("../../index");

async function insertPreImage(imageInfo) {
  const { hash } = imageInfo;

  const col = await getDemocracyPreImageCollection();
  const maybeInDb = await col.findOne({ hash });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(imageInfo);
}

module.exports = {
  insertPreImage,
};
