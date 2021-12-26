const { normalizeCall } = require("../call/normalize");
const { findBlockApi } = require("../../../chain/blockApi");
const { GenericCall } = require("@polkadot/types");

async function getCollectiveProposal(
  motionHash,
  indexer,
  moduleName = "council"
) {
  const blockApi = await findBlockApi(indexer.blockHash);
  if (!blockApi.query[moduleName]) {
    throw new Error(
      `Can not get collective module ${moduleName} at ${indexer.blockHeight}`
    );
  }

  return await blockApi.query[moduleName].proposalOf(motionHash);
}

async function getCollectiveMotionCall(
  motionHash,
  indexer,
  moduleName = "council"
) {
  const raw = await getCollectiveProposal(...arguments);
  const blockApi = await findBlockApi(indexer.blockHash);
  return new GenericCall(blockApi.registry, raw.toHex());
}

async function getCollectiveNormalizedCall(
  motionHash,
  indexer,
  moduleName = "council"
) {
  const call = await getCollectiveMotionCall(...arguments);
  return normalizeCall(call);
}

module.exports = {
  getCollectiveMotionCall,
  getCollectiveNormalizedCall,
};
