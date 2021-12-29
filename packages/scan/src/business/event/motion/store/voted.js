const { getCouncilName } = require("../../../common/motion/utils");
const { handleBusinessWhenMotionVoted } = require("./hooks/voted");
const {
  updateMotionByHash,
} = require("../../../../mongo/service/onchain/motion");
const {
  business: { getCollectiveVotedCommonFields },
} = require("@subsquare/scan-common");

async function handleVoted(event, indexer) {
  const { hash, updates, timelineItem, voting } =
    await getCollectiveVotedCommonFields(event, indexer, getCouncilName());

  await updateMotionByHash(hash, updates, timelineItem);
  await handleBusinessWhenMotionVoted(hash, voting, indexer);
}

module.exports = {
  handleVoted,
};
