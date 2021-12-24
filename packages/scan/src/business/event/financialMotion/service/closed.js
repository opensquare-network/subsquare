const {
  updateFinancialMotionByHash,
} = require("../../../../mongo/service/onchain/financialMotion");
const {
  business: {
    getCollectiveClosedCommonFields,
    consts: { KaruraModules },
  },
} = require("@subsquare/scan-common");

async function handleClosed(event, indexer) {
  const { hash, updates, timelineItem } = await getCollectiveClosedCommonFields(
    event,
    indexer,
    KaruraModules.FinancialCouncil
  );

  await updateFinancialMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleClosed,
};
