const { normalizeCall } = require("../../motion/utils");
const { findDecorated, findRegistry } = require("../../../../specs");
const { getApi } = require("../../../../api");
const { hexToU8a } = require("@polkadot/util");

async function getPreImageFromStorage(hash, indexer) {
  const decorated = await findDecorated(indexer.blockHeight);
  const key = [decorated.query.democracy.preimages, hash];

  const api = await getApi();
  const raw = await api.rpc.state.getStorage(key, indexer.blockHash);
  if (!raw.isSome) {
    return {};
  }

  const availableImage = raw.unwrap().asAvailable.toJSON();
  const registry = await findRegistry(indexer.blockHeight);
  try {
    const call = registry.createType("Proposal", hexToU8a(availableImage.data));
    return {
      ...availableImage,
      imageValid: true,
      call: normalizeCall(call),
    };
  } catch (e) {
    return {
      ...availableImage,
      imageValid: false,
    };
  }
}

module.exports = {
  getPreImageFromStorage,
};
