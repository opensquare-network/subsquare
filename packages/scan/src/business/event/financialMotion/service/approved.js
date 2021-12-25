const {
  updateFinancialMotionByHash,
} = require("../../../../mongo/service/onchain/financialMotion");
const {
  business: {
    getCollectiveApprovedCommonFields,
    consts: { KaruraModules },
  },
} = require("@subsquare/scan-common");

async function handleApproved(event, indexer) {
  const { hash, updates, timelineItem } =
    await getCollectiveApprovedCommonFields(
      event,
      indexer,
      KaruraModules.FinancialCouncil
    );

  await updateFinancialMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleApproved,
};
