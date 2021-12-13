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
    indexer: techCommMotionIndexer,
    hash: techCommMotionHash,
    index: techCommMotionIndex,
    authors,
    proposer,
    externalProposals,
  } = motionObj;
  if ((externalProposals || []).length <= 0) {
    return;
  }

  const { hash: externalProposalHash } = externalProposals[0];
  const col = await getDemocracyExternalCollection();
  const maybeInDb = await col.findOne({
    proposalHash: externalProposalHash,
    isFinal: false,
  });
  if (maybeInDb) {
    await updateDemocracyExternalByHash(externalProposalHash, null, null, {
      index: techCommMotionIndex,
      hash: techCommMotionHash,
      indexer: techCommMotionIndexer,
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
    proposer,
    proposalHash: hash,
    voteThreshold,
    state,
    authors,
    isFinal: true,
    timeline: [],
    techCommMotions: [
      {
        index: techCommMotionIndex,
        hash: techCommMotionHash,
        indexer: techCommMotionIndexer,
      },
    ],
    motions: [],
  };

  await insertDemocracyExternal(externalObj);
  await insertDemocracyPostByExternal(
    externalProposalHash,
    indexer,
    authors[0]
  );
}

module.exports = {
  handleBusinessWhenTechCommMotionProposed,
};
