const {
  updateFinancialMotionByHash,
} = require("../../../../mongo/service/onchain/financialMotion");
const {
  business: {
    getCollectiveExecutedCommonFields,
    consts: { KaruraModules },
  },
} = require("@subsquare/scan-common");

async function handleExecuted(event, indexer) {
  const { hash, updates, timelineItem } =
    await getCollectiveExecutedCommonFields(
      event,
      indexer,
      KaruraModules.FinancialCouncil
    );

  await updateFinancialMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleExecuted,
};
