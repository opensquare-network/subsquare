const { getApi } = require("../../../../api");
const { expandMetadata } = require("@polkadot/types");
const { findMetadata } = require("../../../../specs");

async function getReferendumInfoFromStorage(referendumIndex, indexer) {
  const metadata = await findMetadata(indexer.blockHeight);
  const decorated = expandMetadata(metadata.registry, metadata);
  const key = [decorated.query.democracy.referendumInfoOf, referendumIndex];

  const api = await getApi();
  const raw = await api.rpc.state.getStorage(key, indexer.blockHash);
  return raw.toJSON();
}

async function getReferendumInfoByHeight(referendumIndex, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return getReferendumInfoFromStorage(referendumIndex, {
    blockHeight,
    blockHash,
  });
}

module.exports = {
  getReferendumInfoFromStorage,
  getReferendumInfoByHeight,
};
