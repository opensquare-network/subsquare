const {
  insertReferendumWithExternal,
} = require("../../../common/democracy/referendum/insert");
const {
  insertDemocracyPostByExternal,
} = require("../../../../mongo/service/business/democracy");
const {
  getDemocracyExternalUnFinished,
  insertDemocracyExternal,
  finishExternalByHash,
  updateDemocracyExternalByHash,
} = require("../../../../mongo/service/onchain/democracyExternal");
const {
  business: {
    getExternalFromStorageByHeight,
    consts: {
      TimelineItemTypes,
      DemocracyExternalEvents,
      DemocracyExternalStates,
    },
  },
} = require("@subsquare/scan-common");

async function _insertExternal(eventIndexer, proposalHash, voteThreshold) {
  const state = {
    indexer: eventIndexer,
    state: DemocracyExternalStates.Tabled,
    data: [hash, voteThreshold],
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: DemocracyExternalEvents.ExternalTabled,
    args: [],
    indexer: eventIndexer,
  };

  const externalObj = {
    indexer: eventIndexer,
    proposalHash,
    voteThreshold,
    state,
    isFinal: false,
    timeline: [timelineItem],
    techCommMotions: [],
    motions: [],
  };

  await insertDemocracyExternal(externalObj);
  await insertDemocracyPostByExternal(proposalHash, eventIndexer);
}

async function _updateExternal(eventIndexer, hash) {
  const externalState = {
    indexer: eventIndexer,
    state: DemocracyExternalStates.Tabled,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: DemocracyExternalEvents.ExternalTabled,
    args: [],
    indexer: eventIndexer,
  };

  await updateDemocracyExternalByHash(
    hash,
    {
      state: externalState,
    },
    timelineItem
  );
}

async function handleExternalTabled(event, eventIndexer, blockEvents) {
  const [hash, voteThreshold] = await getExternalFromStorageByHeight(
    eventIndexer.blockHeight - 1 // external will be removed after tabled
  );

  const maybeInDb = await getDemocracyExternalUnFinished(hash);
  if (!maybeInDb) {
    await _insertExternal(eventIndexer, hash, voteThreshold);
  } else {
    await _updateExternal(eventIndexer, hash);
  }

  const external = await getDemocracyExternalUnFinished(hash);
  const referendumStartedEvent = blockEvents[eventIndexer.eventIndex + 1].event;
  await insertReferendumWithExternal(
    referendumStartedEvent,
    eventIndexer,
    hash,
    external.indexer
  );

  await finishExternalByHash(hash);
}

module.exports = {
  handleExternalTabled,
};
