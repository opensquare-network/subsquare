const { findBlockApi } = require("../../../chain/specs");
const { getApi } = require("../../../api");

async function getBountyMeta(bountyIndex, indexer) {
  const blockApi = await findBlockApi(indexer);

  let rawMeta;
  if (blockApi.query.treasury?.bounties) {
    rawMeta = await blockApi.query.treasury?.bounties(bountyIndex);
  } else {
    rawMeta = await blockApi.query.bounties.bounties(bountyIndex);
  }

  return rawMeta.toJSON();
}

async function getBountyMetaByHeight(bountyIndex, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return await getBountyMeta(bountyIndex, { blockHeight, blockHash });
}

module.exports = {
  getBountyMeta,
  getBountyMetaByHeight,
};
