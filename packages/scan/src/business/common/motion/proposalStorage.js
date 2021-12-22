const { getCouncilName } = require("./utils");
const {
  business: { getCollectiveMotionCall },
} = require("@subsquare/scan-common");

async function getMotionCall(motionHash, indexer) {
  const councilModuleName = getCouncilName();
  return getCollectiveMotionCall(motionHash, indexer, councilModuleName);
}

module.exports = {
  getMotionCall,
};
