const {
  updateTechCommMotionByHash,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  business: { getCollectiveDisApprovedCommonFields },
} = require("@subsquare/scan-common");

async function handleDisApproved(event, extrinsic, indexer) {
  const { hash, updates, timelineItem } =
    await getCollectiveDisApprovedCommonFields(event, indexer);

  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleDisApproved,
};
