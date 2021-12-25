const {
  updateFinancialMotionByHash,
} = require("../../../../mongo/service/onchain/financialMotion");
const {
  business: {
    getCollectiveDisApprovedCommonFields,
    consts: { KaruraModules },
  },
} = require("@subsquare/scan-common");

async function handleDisApproved(event, indexer) {
  const { hash, updates, timelineItem } =
    await getCollectiveDisApprovedCommonFields(
      event,
      indexer,
      KaruraModules.FinancialCouncil
    );

  await updateFinancialMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleDisApproved,
};
