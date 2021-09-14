const {
  getExternalFromStorage,
} = require("../../../../common/democracy/external");
const {
  insertDemocracyPostByExternal,
} = require("../../../../../mongo/service/business/democracy");
const { DemocracyExternalStates } = require("../../../../common/constants");
const {
  insertDemocracyExternal,
  updateDemocracyExternalByHash,
} = require("../../../../../mongo/service/onchain/democracyExternal");
const { getDemocracyExternalCollection } = require("../../../../../mongo");

async function handleBusinessWhenTechCommMotionProposed(
  motionObj = {},
  indexer
) {
  const {
    isDemocracy,
    externalProposalHash,
    index: techCommMotionIndex,
    authors,
  } = motionObj;
  if (!isDemocracy) {
    return;
  }

  const col = await getDemocracyExternalCollection();
  const maybeInDb = await col.findOne({
    proposalHash: externalProposalHash,
    isFinal: false,
  });
  if (maybeInDb) {
    await updateDemocracyExternalByHash(externalProposalHash, {
      techCommMotionIndex,
    });
    return;
  }

  const [hash, voteThreshold] = await getExternalFromStorage(indexer);
  const state = {
    indexer,
    state: DemocracyExternalStates.Proposed,
  };

  const externalObj = {
    indexer,
    proposalHash: hash,
    voteThreshold,
    state,
    authors,
    isFinal: true,
    timeline: [],
  };

  await insertDemocracyExternal(externalObj);
  await insertDemocracyPostByExternal(externalProposalHash, indexer, authors[0]);
}

module.exports = {
  handleBusinessWhenTechCommMotionProposed,
};
