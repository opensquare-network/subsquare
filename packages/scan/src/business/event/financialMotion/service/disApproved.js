const {
  updateFinancialMotionByHash,
} = require("../../../../mongo/service/onchain/financialMotion");
const {
  business: { getCollectiveDisApprovedCommonFields },
} = require("@subsquare/scan-common");

async function handleDisApproved(event, indexer) {
  const { hash, updates, timelineItem } =
    await getCollectiveDisApprovedCommonFields(event, indexer);

  await updateFinancialMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleDisApproved,
};
