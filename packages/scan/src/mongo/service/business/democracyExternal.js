const { getBusinessDemocracyExternalCollection } = require("../../business");

async function insertExternalPost(proposalHash) {
  const col = await getBusinessDemocracyExternalCollection();
  const maybeInDb = await col.findOne({ proposalHash });
  if (maybeInDb) {
    return;
  }

  await col.insertOne({ proposalHash });
}

module.exports = {
  insertDemocracyExternalPost: insertExternalPost(),
};
