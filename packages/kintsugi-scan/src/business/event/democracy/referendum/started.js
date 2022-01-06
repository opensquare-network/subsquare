const { getDemocracyReferendumCollection } = require("../../../../mongo");

async function checkReferendumAtStarted(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex] = eventData;

  const col = await getDemocracyReferendumCollection();
  const maybeInDb = await col.findOne({ referendumIndex });
  if (!maybeInDb) {
    throw new Error(`can not find referendum at ${indexer.blockHeight}`);
  }
}

module.exports = {
  checkReferendumAtStarted,
};
