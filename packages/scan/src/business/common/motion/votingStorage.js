const { getCouncilName } = require("./utils");
const {
  business: { getCollectiveVoting, getCollectiveVotingByHeight },
} = require("@subsquare/scan-common");

async function getMotionVoting(motionHash, indexer) {
  const councilModuleName = getCouncilName();
  return getCollectiveVoting(motionHash, indexer, councilModuleName);
}

async function getVotingFromStorageByHeight(motionHash, blockHeight) {
  const councilModuleName = getCouncilName();
  return getCollectiveVotingByHeight(
    motionHash,
    blockHeight,
    councilModuleName
  );
}

module.exports = {
  getVotingFromStorage: getMotionVoting,
  getVotingFromStorageByHeight,
  getMotionVoting,
};
