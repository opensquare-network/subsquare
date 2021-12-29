const {
  updateTechCommMotionByHash,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  business: {
    getCollectiveApprovedCommonFields,
    consts: { Modules },
  },
} = require("@subsquare/scan-common");

async function handleApproved(event, extrinsic, indexer) {
  const { hash, updates, timelineItem } =
    await getCollectiveApprovedCommonFields(
      event,
      indexer,
      Modules.TechnicalCommittee
    );

  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleApproved,
};
