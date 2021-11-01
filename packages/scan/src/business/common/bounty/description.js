const { findBlockApi } = require("../../../chain/specs");

async function getBountyDescription(bountyIndex, indexer) {
  const blockApi = await findBlockApi(indexer);

  let rawMeta;
  if (blockApi.query.treasury?.bountyDescriptions) {
    rawMeta = await blockApi.query.treasury?.bountyDescriptions(bountyIndex);
  } else {
    rawMeta = await blockApi.query.bounties.bountyDescriptions(bountyIndex);
  }

  return rawMeta.toHuman();
}

module.exports = {
  getBountyDescription,
};
