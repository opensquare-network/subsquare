const { expandMetadata } = require("@polkadot/types");
const { findMetadata } = require("../../../mongo/service/specs");
const { getApi } = require("../../../api");

async function getMeta(blockHash, proposalIndex) {
  const api = await getApi();
  // Some very early proposal meta of Kusama can not be got in this way
  const rawMeta = await api.query.treasury.proposals.at(
    blockHash,
    proposalIndex
  );
  let meta = rawMeta.toJSON();

  if (!meta) {
    throw new Error("Can not find treasury proposal meta");
  }

  return meta;
}

async function getTreasuryProposalMeta(
  proposalIndex,
  { blockHeight, blockHash }
) {
  const api = await getApi();

  const metadata = await findMetadata(blockHeight);
  const decorated = expandMetadata(metadata.registry, metadata);
  const key = [decorated.query.treasury.proposals, proposalIndex];
  const rawMeta = await api.rpc.state.getStorage(key, blockHash);
  return rawMeta.toJSON();
}

module.exports = {
  getTreasuryProposalMeta,
};
