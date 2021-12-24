const {
  handleBusinessWhenTechCommMotionExecuted,
} = require("./hooks/executed");
const {
  updateTechCommMotionByHash,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  business: {
    getCollectiveExecutedCommonFields,
    consts: { Modules },
  },
} = require("@subsquare/scan-common");

async function handleExecuted(event, extrinsic, indexer, blockEvents) {
  const { hash, isOk, updates, timelineItem } =
    await getCollectiveExecutedCommonFields(
      event,
      indexer,
      Modules.TechnicalCommittee
    );

  if (isOk) {
    await handleBusinessWhenTechCommMotionExecuted(hash, indexer, blockEvents);
  }
  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleExecuted,
};
