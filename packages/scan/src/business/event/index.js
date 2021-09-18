const { handlePreImageEvent } = require("./democracy/preimage");
const {
  handleDemocracyPublicProposalEvent,
  handleDemocracyPublicProposalEventWithoutExtrinsic,
} = require("./democracy/publicProposal");
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
  blockEvents
) {
  const indexer = {
    ...blockIndexer,
    eventIndex: eventSort,
    extrinsicIndex,
  };

  await handleDemocracyPublicProposalEvent(
    event,
    extrinsic,
    indexer,
    blockEvents
  );
  await handleTipEvent(event, extrinsic, indexer);
  await handleTreasuryProposalEvent(event, extrinsic, indexer);
  await handleMotionEvent(event, extrinsic, indexer);
  await handleReferendumEventWithExtrinsic(
    event,
    extrinsic,
    indexer,
    blockEvents
  );
  await handleTechCommMotionEvent(event, extrinsic, indexer, blockEvents);
  await handleDemocracyExternalEvent(event, extrinsic, indexer, blockEvents);
  await handlePreImageEvent(event, extrinsic, indexer, blockEvents);
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

  await handleDemocracyPublicProposalEventWithoutExtrinsic(
    event,
    indexer,
    blockEvents
  );
  await handleReferendumEventWithoutExtrinsic(event, indexer, blockEvents);
  await handleDemocracyExternalEventNoExtrinsic(event, indexer, blockEvents);
}

async function handleEvents(events, extrinsics, blockIndexer) {
  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    if (phase.isNull) {
      await handleEventWithoutExtrinsic(blockIndexer, event, sort, events);
      continue;
    }

    const extrinsicIndex = phase.value.toNumber();
    const extrinsic = extrinsics[extrinsicIndex];
    await handleEventWithExtrinsic(
      blockIndexer,
      event,
      sort,
      extrinsic,
      extrinsicIndex,
      events
    );
  }
}

module.exports = {
  handleEvents,
};
