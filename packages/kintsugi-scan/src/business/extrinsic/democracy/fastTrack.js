const {
  insertReferendumWithPublicProposal,
} = require("../../event/democracy/referendum/insert");
const {
  publicProposalState,
} = require("../../event/democracy/publicProposal/constants");
const {
  updateDemocracyPublicProposal,
} = require("../../../mongo/service/onchain/democracyPublicProposal");
const {
  business: {
    consts: {
      Modules,
      DemocracyMethods,
      ReferendumEvents,
      DemocracyPublicProposalEvents,
      TimelineItemTypes,
    },
  },
  log: { busLogger },
} = require("@subsquare/scan-common");

function checkTable(extrinsicIndexer, blockEvents) {
  const extrinsicEvents = blockEvents.filter(
    (e) =>
      !e.phase.isNone && e.phase.value.toNumber() === extrinsicIndexer.index
  );
  const startedEvent = extrinsicEvents.find(
    (e) => e.event.method === ReferendumEvents.Started
  );
  const fastTrackEvent = extrinsicEvents.find(
    (e) => e.event.method === "FastTrack"
  );

  return {
    isTabled: !!(startedEvent && fastTrackEvent),
    startedEvent,
    fastTrackEvent,
  };
}

async function handleFastTrack(call, signer, extrinsicIndexer, blockEvents) {
  const { section, method } = call;
  if (Modules.Democracy !== section || DemocracyMethods.fastTrack !== method) {
    return;
  }

  busLogger.info(
    `Democracy fast track detected at ${extrinsicIndexer.blockHeight}`
  );
  const publicProposalIndex = call.args[0].toNumber();
  const { isTabled, startedEvent, fastTrackEvent } = checkTable(
    extrinsicIndexer,
    blockEvents
  );
  if (!isTabled) {
    return;
  }

  const [referendumIndex, threshold] = startedEvent.event.data.toJSON();

  const indexer = {
    ...extrinsicIndexer,
    extrinsicIndex: extrinsicIndexer.index,
    eventIndex: fastTrackEvent.phase.toNumber(),
  };

  const state = {
    indexer,
    state: DemocracyPublicProposalEvents.Tabled,
  };

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: publicProposalState.FastTracked,
    args: {
      referendumIndex,
      threshold,
    },
    indexer,
  };
  await updateDemocracyPublicProposal(
    publicProposalIndex,
    {
      state,
      referendumIndex,
    },
    timelineItem
  );

  await insertReferendumWithPublicProposal(
    startedEvent.event,
    indexer,
    publicProposalIndex
  );
}

module.exports = {
  handleFastTrack,
};
