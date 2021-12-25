const { getCouncilName } = require("../../../common/motion/utils");
const {
  updateMotionByHash,
} = require("../../../../mongo/service/onchain/motion");
const {
  business: { getCollectiveClosedCommonFields },
} = require("@subsquare/scan-common");

async function handleClosed(event, extrinsic, indexer) {
  const { hash, updates, timelineItem } = await getCollectiveClosedCommonFields(
    event,
    indexer,
    getCouncilName()
  );

  await updateMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleClosed,
};
