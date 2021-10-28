const { getBusinessBountyCollection } = require("../../business");

async function insertBountyPost(bountyIndex) {
  const col = await getBusinessBountyCollection();
  const maybeInDb = await col.findOne({ bountyIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne({
    bountyIndex,
  });
}

module.exports = {
  insertBountyPost,
};
