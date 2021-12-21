const { getBusinessBountyCollection } = require("../../business");

async function insertBountyPost(bountyIndex, description, proposer, indexer) {
  const col = await getBusinessBountyCollection();
  const maybeInDb = await col.findOne({ bountyIndex });
  if (maybeInDb) {
    return;
  }

  const blockTime = new Date(indexer.blockTime);
  await col.insertOne({
    bountyIndex,
    title: description,
    proposer,
    content: "",
    contentType: "markdown",
    createdAt: blockTime,
    updatedAt: blockTime,
    lastActivityAt: blockTime,
  });
}

module.exports = {
  insertBountyPost,
};
