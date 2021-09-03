const { expandMetadata } = require("@polkadot/types");
const { findMetadata } = require("../../../specs");
const { getApi } = require("../../../api");

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
