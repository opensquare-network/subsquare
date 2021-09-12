const {
  insertDemocracyExternal,
  updateDemocracyExternalByHash,
  finishExternalByHash,
  getDemocracyExternalUnFinished,
} = require("../../../mongo/service/onchain/democracyExternal");
const {
  insertDemocracyReferendum,
} = require("../../../mongo/service/onchain/democracyReferendum");
const {
  getReferendumInfoFromStorage,
} = require("../../event/democracy/common/referendumStorage");
const {
  insertDemocracyPostByExternal,
} = require("../../../mongo/service/business/democracy");
const {
  getExternalFromStorageByHeight,
} = require("../../common/democracy/external");
const { TimelineItemTypes } = require("../../common/constants");
const {
  Modules,
  DemocracyMethods,
  DemocracyExternalStates,
  ReferendumEvents,
} = require("../../common/constants");

function isFastTrackCall(call) {
  return (
    call.section === Modules.Democracy &&
    DemocracyMethods.fastTrack === call.method
  );
}

async function handleFastTrack(call, signer, extrinsicIndexer, events) {
  if (!isFastTrackCall(call)) {
    return;
  }

  const {
    args: { proposal_hash: proposalHash },
  } = call.toJSON();

  const maybeInDb = await getDemocracyExternalUnFinished(proposalHash);
  if (!maybeInDb) {
    await insertExternal(call, signer, extrinsicIndexer, events);
  } else {
    await updateExternal(call, signer, extrinsicIndexer, events);
  }

  if (hasReferendumStarted(events)) {
    const referendumStartedEvent = events.find(
      (e) =>
        e.event.section === Modules.Democracy &&
        e.event.method === ReferendumEvents.Started
    );
    await insertReferendum(
      referendumStartedEvent,
      extrinsicIndexer,
      proposalHash
    );
  }
  await finishExternalByHash(proposalHash);
}

function extractMetadata(call, signer, extrinsicIndexer) {
  const {
    args: { proposal_hash: proposalHash, voting_period: votingPeriod, delay },
  } = call.toJSON();

  const state = {
    indexer: extrinsicIndexer,
    state: DemocracyExternalStates.Tabled,
    data: [proposalHash, votingPeriod, delay],
  };

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: DemocracyMethods.fastTrack,
    args: {
      proposalHash,
      votingPeriod,
      delay,
    },
    indexer: extrinsicIndexer,
  };

  return {
    args: {
      proposalHash,
      votingPeriod,
      delay,
    },
    state,
    timelineItem,
  };
}

async function updateExternal(call, signer, extrinsicIndexer) {
  const { args, state, timelineItem } = extractMetadata(
    call,
    signer,
    extrinsicIndexer
  );

  await updateDemocracyExternalByHash(
    args.proposalHash,
    { state },
    timelineItem
  );
}

async function insertExternal(call, signer, extrinsicIndexer) {
  const { args, state, timelineItem } = extractMetadata(
    call,
    signer,
    extrinsicIndexer
  );

  const [hash, voteThreshold] = await getExternalFromStorageByHeight(
    extrinsicIndexer.blockHeight - 1
  );
  if (hash !== args.proposalHash) {
    throw new Error("Not matched external hash");
  }

  const externalObj = {
    indexer: extrinsicIndexer,
    proposalHash: args.proposalHash,
    voteThreshold,
    authors: [signer],
    state,
    isFinal: false,
    timeline: [timelineItem],
  };

  await insertDemocracyExternal(externalObj);
  await insertDemocracyPostByExternal(args.proposalHash, extrinsicIndexer);
}

async function insertReferendum(event, extrinsicIndexer, externalProposalHash) {
  const eventData = event.event.data.toJSON();
  const [referendumIndex, threshold] = eventData;

  const referendumInfo = await getReferendumInfoFromStorage(
    referendumIndex,
    extrinsicIndexer
  );

  const state = {
    indexer: extrinsicIndexer,
    state: ReferendumEvents.Started,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: ReferendumEvents.Started,
    args: {
      referendumIndex,
      voteThreshold: threshold,
    },
    indexer: extrinsicIndexer,
  };

  const external = await getDemocracyExternalUnFinished(externalProposalHash);
  const obj = {
    indexer: extrinsicIndexer,
    referendumIndex,
    info: referendumInfo,
    externalProposalHash,
    externalProposalIndexer: external.indexer,
    state,
    timeline: [timelineItem],
  };

  await insertDemocracyReferendum(obj);
  await updateDemocracyExternalByHash(externalProposalHash, {
    isFinal: true,
    referendumIndex,
  });
}

function hasReferendumStarted(events) {
  return events.some(({ event: e }) => {
    return (
      e.section === Modules.Democracy && e.method === ReferendumEvents.Started
    );
  });
}

module.exports = {
  handleFastTrack,
};
