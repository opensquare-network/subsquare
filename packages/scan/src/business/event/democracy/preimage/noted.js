const {
  insertPreImage,
} = require("../../../../mongo/service/onchain/democracyPreImage");
const {
  getPreImageFromStorage,
} = require("../../../common/democracy/preImage/storage");

async function handleNoted(event, indexer) {
  const eventData = event.data.toJSON();
  const [hash] = eventData;

  const imageInfo = await getPreImageFromStorage(hash, indexer);
  const obj = {
    hash,
    ...imageInfo,
    indexer,
  };

  await insertPreImage(obj);
}

module.exports = {
  handleNoted,
};
