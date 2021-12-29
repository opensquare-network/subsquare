const { findBlockApi } = require("../../../../chain/blockApi");
const { getApi } = require("../../../../chain");

async function getExternalFromStorage(indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.democracy.nextExternal();
  return raw.toJSON();
}

async function getExternalFromStorageByHeight(blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return await getExternalFromStorage({ blockHash, blockHeight });
}

module.exports = {
  getExternalFromStorage,
  getExternalFromStorageByHeight,
};
