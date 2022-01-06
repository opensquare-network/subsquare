const {
  updatePreImage,
} = require("../../../../mongo/service/onchain/democracyPreImage");

async function handleUsed(event, indexer) {
  const eventData = event.data.toJSON();
  const [hash] = eventData;

  await updatePreImage(hash, {
    usedIndexer: indexer,
  });
}

module.exports = {
  handleUsed,
};
