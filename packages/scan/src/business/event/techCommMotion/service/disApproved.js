const {
  updateTechCommMotionByHash,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  business: {
    getCollectiveDisApprovedCommonFields,
    consts: { Modules },
  },
} = require("@subsquare/scan-common");

async function handleDisApproved(event, extrinsic, indexer) {
  const { hash, updates, timelineItem } =
    await getCollectiveDisApprovedCommonFields(
      event,
      indexer,
      Modules.TechnicalCommittee
    );

  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleDisApproved,
};
