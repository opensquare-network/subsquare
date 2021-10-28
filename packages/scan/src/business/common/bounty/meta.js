const { getApi } = require("../../../api");
const { findBlockApi } = require("../../../chain/blockApi");

async function getBountyMeta(bountyIndex, { blockHeight, blockHash }) {
  const blockApi = await findBlockApi(blockHash);

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
