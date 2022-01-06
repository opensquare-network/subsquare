const {
  updateTechCommMotionByHash,
} = require("../../../mongo/service/onchain/techCommMotion");
const {
  business: {
    getCollectiveExecutedCommonFields,
    consts: { Modules },
  },
} = require("@subsquare/scan-common");

async function handleExecuted(event, extrinsic, indexer) {
  const { hash, updates, timelineItem } =
    await getCollectiveExecutedCommonFields(
      event,
      indexer,
      Modules.TechnicalCommittee
    );
  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleExecuted,
};
