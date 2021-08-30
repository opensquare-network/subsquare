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

module.exports = {
  getTreasuryProposalMeta: getMeta,
};
