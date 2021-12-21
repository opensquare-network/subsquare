const { getBusinessBountyCollection } = require("../../business");

async function insertBountyPost(bountyIndex, description, proposer, indexer) {
  const col = await getBusinessBountyCollection();
  const maybeInDb = await col.findOne({ bountyIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne({
    bountyIndex,
    title: description,
    proposer,
    content: "",
    contentType: "markdown",
    createdAt: indexer.blockTime,
    updatedAt: indexer.blockTime,
    lastActivityAt: indexer.blockTime,
  });
}

module.exports = {
  insertBountyPost,
};
