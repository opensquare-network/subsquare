const {
  chain: { findBlockApi },
} = require("@subsquare/scan-common");

async function getBountyDescription(bountyIndex, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);

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
