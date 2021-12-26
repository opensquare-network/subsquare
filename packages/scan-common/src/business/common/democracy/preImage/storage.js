const { busLogger } = require("../../../../logger");
const { normalizeCall } = require("../../call/normalize");
const { findBlockApi } = require("../../../../chain/blockApi");
const { hexToU8a } = require("@polkadot/util");

async function getPreImageFromStorage(hash, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.democracy.preimages(hash);
  if (!raw.isSome) {
    return {};
  }

  const availableImage = raw.unwrap().asAvailable.toJSON();
  try {
    const call = blockApi.registry.createType(
      "Proposal",
      hexToU8a(availableImage.data)
    );
    busLogger.info(`new valid preimage detected at ${indexer.blockHeight}`);
    return {
      ...availableImage,
      imageValid: true,
      call: normalizeCall(call),
    };
  } catch (e) {
    busLogger.info(`invalid preimage detected at ${indexer.blockHeight}`);
    return {
      ...availableImage,
      imageValid: false,
    };
  }
}

module.exports = {
  getPreImageFromStorage,
};
