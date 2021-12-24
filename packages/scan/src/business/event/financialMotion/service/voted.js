const {
  updateFinancialMotionByHash,
} = require("../../../../mongo/service/onchain/financialMotion");
const {
  business: {
    getCollectiveVotedCommonFields,
    consts: { KaruraModules },
  },
} = require("@subsquare/scan-common");

async function handleVoted(event, indexer) {
  const { hash, updates, timelineItem } = await getCollectiveVotedCommonFields(
    event,
    indexer,
    KaruraModules.FinancialCouncil
  );

  await updateFinancialMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleVoted,
};
