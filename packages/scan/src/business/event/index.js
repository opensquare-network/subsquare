const {
  handleDemocracyExternalEvent,
  handleDemocracyExternalEventNoExtrinsic,
} = require("./democracy/external");
const { handleTechCommMotionEvent } = require("./techCommMotion");
const {
  handleReferendumEventWithoutExtrinsic,
} = require("./democracy/referendum");
const {
  handleReferendumEventWithExtrinsic,
} = require("./democracy/referendum");
const {
  saveNewPublicProposal,
  handlePublicProposalTabled,
} = require("./democracy/publicProposal/store");
const { handleTipEvent } = require("./tip");
const { handleMotionEvent } = require("./motion");
const {
  handleTreasuryProposalEvent,
  handleTreasuryProposalEventWithoutExtrinsic,
} = require("./treasuryProposal");

async function handleEventWithExtrinsic(
  blockIndexer,
  event,
  eventSort,
  extrinsic,
  extrinsicIndex,
  extrinsicEvents
) {
  const indexer = {
    ...blockIndexer,
    eventIndex: eventSort,
    extrinsicIndex,
  };

  await saveNewPublicProposal(event, extrinsic, indexer);
  await handleTipEvent(event, extrinsic, indexer);
  await handleTreasuryProposalEvent(event, extrinsic, indexer);
  await handleMotionEvent(event, extrinsic, indexer);
  await handleReferendumEventWithExtrinsic(event, extrinsic, indexer);
  await handleTechCommMotionEvent(event, extrinsic, indexer, extrinsicEvents);
  await handleDemocracyExternalEvent(
    event,
    extrinsic,
    indexer,
    extrinsicEvents
  );
}

async function handleEventWithoutExtrinsic(
  blockIndexer,
  event,
  eventSort,
  blockEvents
) {
  const indexer = {
    ...blockIndexer,
    eventIndex: eventSort,
  };

  await handleTreasuryProposalEventWithoutExtrinsic(
    event,
    indexer,
    blockEvents
  );

  await handlePublicProposalTabled(event, indexer, blockEvents);
  await handleReferendumEventWithoutExtrinsic(event, indexer, blockEvents);
  await handleDemocracyExternalEventNoExtrinsic(event, indexer, blockEvents);
}

async function handleEvents(events, extrinsics, blockIndexer) {
  const extrinsicEvents = extrinsics.map((extrinsic, index) =>
    events.filter(
      ({ phase }) => !phase.isNull && phase.value.toNumber() === index
    )
  );

  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    if (phase.isNull) {
      await handleEventWithoutExtrinsic(blockIndexer, event, sort, events);
      continue;
    }

    const extrinsicIndex = phase.value.toNumber();
    const extrinsic = extrinsics[extrinsicIndex];
    const relatedEvents = extrinsicEvents[extrinsicIndex];
    await handleEventWithExtrinsic(
      blockIndexer,
      event,
      sort,
      extrinsic,
      extrinsicIndex,
      relatedEvents
    );
  }
}

module.exports = {
  handleEvents,
};
