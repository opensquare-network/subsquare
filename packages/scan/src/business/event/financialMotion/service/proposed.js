const {
  insertFinancialMotionPost,
} = require("../../../../mongo/service/business/financialMotion");
const {
  insertFinancialMotion,
} = require("../../../../mongo/service/onchain/financialMotion");
const {
  business: {
    getCollectiveMotionCommonFields,
    consts: { KaruraModules },
  },
} = require("@subsquare/scan-common");

async function handleProposed(event, indexer, extrinsicEvents, extrinsic) {
  const { common } = await getCollectiveMotionCommonFields(
    event,
    indexer,
    extrinsic,
    KaruraModules.FinancialCouncil
  );
  const { proposer, index, hash } = common;

  await insertFinancialMotion(common);
  await insertFinancialMotionPost(indexer, hash, index, proposer);
}

module.exports = {
  handleProposed,
};
