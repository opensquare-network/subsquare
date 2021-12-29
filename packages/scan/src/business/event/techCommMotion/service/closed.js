const {
  updateTechCommMotionByHash,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  business: {
    getCollectiveClosedCommonFields,
    consts: { Modules },
  },
} = require("@subsquare/scan-common");

async function handleClosed(event, extrinsic, indexer) {
  const { hash, updates, timelineItem } = await getCollectiveClosedCommonFields(
    event,
    indexer,
    Modules.TechnicalCommittee
  );

  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleClosed,
};
