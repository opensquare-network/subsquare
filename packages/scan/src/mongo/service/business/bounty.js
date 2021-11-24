const { getBusinessBountyCollection } = require("../../business");

async function insertBountyPost(bountyIndex, description, proposer) {
  const col = await getBusinessBountyCollection();
  const maybeInDb = await col.findOne({ bountyIndex });
  if (maybeInDb) {
    return;
  }

  const now = new Date();
  await col.insertOne({
    bountyIndex,
    title: description,
    proposer,
    content: "",
    contentType: "markdown",
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
  });
}

module.exports = {
  insertBountyPost,
};
