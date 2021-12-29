const {
  updateTechCommMotionByHash,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  business: {
    getCollectiveVotedCommonFields,
    consts: { Modules },
  },
} = require("@subsquare/scan-common");

async function handleVoted(event, extrinsic, indexer) {
  const { hash, updates, timelineItem } = await getCollectiveVotedCommonFields(
    event,
    indexer,
    Modules.TechnicalCommittee
  );

  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleVoted,
};
