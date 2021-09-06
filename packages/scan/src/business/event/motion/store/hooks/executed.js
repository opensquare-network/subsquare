const {
  getExternalFromStorage,
} = require("../../../../common/democracy/external");
const { getMotionCollection } = require("../../../../../mongo");

async function handleBusinessWhenMotionExecuted(motionHash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash });
  if (!motion) {
    return;
  }

  const { isDemocracy, proposalHash } = motion;
  if (!isDemocracy) {
    return;
  }

  const [hash, voteThreshold] = await getExternalFromStorage(indexer);
  if (hash !== proposalHash) {
    throw new Error("Not matched external hash");
  }
  // TODO: Save the external object to database
}

module.exports = {
  handleBusinessWhenMotionExecuted,
};
