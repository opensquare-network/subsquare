const { getApi } = require("../../../api");
const { findDecorated } = require("../../../specs");

async function getExternalFromStorage(indexer) {
  const decorated = await findDecorated(indexer.blockHeight);
  const key = [decorated.query.democracy.nextExternal];
  const api = await getApi();
  const raw = await api.rpc.state.getStorage(key, indexer.blockHash);
  return raw.toJSON();
}

module.exports = {
  getExternalFromStorage,
};
