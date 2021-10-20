const { getApi } = require("../api");
let blockApiMap = {};

function setBlockApi(blockHash, api) {
  blockApiMap[blockHash] = api;
}

function removeBlockApi(blockHash) {
  delete blockApiMap[blockHash];
}

async function findBlockApi(blockHash) {
  const maybe = blockApiMap[blockHash];
  if (maybe) {
    return maybe;
  }

  const api = await getApi();
  const blockApi = await api.at(blockHash);

  setBlockApi(blockHash, blockApi);
  return blockApi;
}

async function findRegistryByHash(blockHash) {
  const blockApi = await findBlockApi(blockHash);
  return blockApi.registry;
}

module.exports = {
  findBlockApi,
  removeBlockApi,
  findRegistryByHash,
};
