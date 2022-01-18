const { handleBusinessWhenMotionDisApproved } = require("./hooks/disApproved");
const {
  updateMotionByHash,
} = require("../../../../mongo/service/onchain/motion");
const {
  business: { getCollectiveDisApprovedCommonFields },
} = require("@subsquare/scan-common");

async function handleDisApproved(event, extrinsic, indexer) {
  const { hash, updates, timelineItem } =
    await getCollectiveDisApprovedCommonFields(event, indexer);

  await handleBusinessWhenMotionDisApproved(hash, indexer);
  await updateMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleDisApproved,
};
