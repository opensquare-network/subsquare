const {
  insertDemocracyPostByExternal,
} = require("../../../mongo/service/business/democracy");
const {
  insertDemocracyExternal,
} = require("../../../mongo/service/onchain/democracyExternal");
const { getExternalFromStorage } = require("../../common/democracy/external");
const {
  Modules,
  TimelineItemTypes,
  DemocracyMethods,
  DemocracyExternalStates,
} = require("../../common/constants");

function isExternalProposeCall(call) {
  return (
    call.section === Modules.Democracy &&
    [
      DemocracyMethods.externalPropose,
      DemocracyMethods.externalProposeDefault,
      DemocracyMethods.externalProposeMajority,
    ].includes(call.method)
  );
}

async function handleExternalPropose(call, signer, extrinsicIndexer) {
  if (!isExternalProposeCall(call)) {
    return;
  }

  const [hash, voteThreshold] = await getExternalFromStorage(extrinsicIndexer);
  const state = {
    indexer: extrinsicIndexer,
    state: DemocracyExternalStates.Proposed,
    data: [hash, voteThreshold],
  };

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: call.method,
    args: {
      proposalHash: hash,
    },
    indexer: extrinsicIndexer,
  };

  const externalObj = {
    indexer: extrinsicIndexer,
    proposer: signer,
    proposalHash: hash,
    voteThreshold,
    state,
    authors: [signer],
    isFinal: false,
    timeline: [timelineItem],
    techCommMotions: [],
  };

  await insertDemocracyExternal(externalObj);
  await insertDemocracyPostByExternal(hash, extrinsicIndexer, signer);
}

module.exports = {
  handleExternalPropose,
};
