const { getCouncilName } = require("../../../common/motion/utils");
const { handleBusinessWhenMotionApproved } = require("./hooks/approved");
const {
  updateMotionByHash,
} = require("../../../../mongo/service/onchain/motion");
const {
  business: { getCollectiveApprovedCommonFields },
} = require("@subsquare/scan-common");

async function handleApproved(event, extrinsic, indexer) {
  const { hash, updates, timelineItem } =
    await getCollectiveApprovedCommonFields(event, indexer, getCouncilName());

  await updateMotionByHash(hash, updates, timelineItem);
  await handleBusinessWhenMotionApproved(hash, indexer);
}

module.exports = {
  handleApproved,
};
