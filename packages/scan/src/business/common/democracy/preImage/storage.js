const { findBlockApi } = require("../../../../chain/specs");
const { findRegistry } = require("../../../../chain/specs");
const { normalizeCall } = require("../../motion/utils");
const { hexToU8a } = require("@polkadot/util");

async function getPreImageFromStorage(hash, indexer) {
  const blockApi = await findBlockApi(indexer);
  const raw = await blockApi.query.democracy.preimages(hash);
  if (!raw.isSome) {
    return {};
  }

  const availableImage = raw.unwrap().asAvailable.toJSON();
  const registry = await findRegistry(indexer);
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
