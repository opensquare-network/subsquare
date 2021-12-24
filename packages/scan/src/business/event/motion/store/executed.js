const { getCouncilName } = require("../../../common/motion/utils");
const { handleBusinessWhenMotionExecuted } = require("./hooks/executed");
const {
  updateMotionByHash,
} = require("../../../../mongo/service/onchain/motion");
const {
  log: { logger },
} = require("@subsquare/scan-common");
const {
  business: { getCollectiveExecutedCommonFields },
} = require("@subsquare/scan-common");

async function handleExecuted(event, extrinsic, indexer) {
  const { hash, isOk, updates, timelineItem } =
    await getCollectiveExecutedCommonFields(event, indexer, getCouncilName());

  try {
    if (isOk) {
      await handleBusinessWhenMotionExecuted(hash, indexer);
    }
  } catch (e) {
    logger.error("Handle motion executed hooks failed", e);
  } finally {
    await updateMotionByHash(hash, updates, timelineItem);
  }
}

module.exports = {
  handleExecuted,
};
