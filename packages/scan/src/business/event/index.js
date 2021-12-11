const { handleBountyEvent } = require("./bounty");
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
const { handleTreasuryEvent } = require("./treasuryProposal");

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

  await handlePreImageEvent(event, extrinsic, indexer, blockEvents);
  await handleDemocracyPublicProposalEvent(
    event,
    extrinsic,
    indexer,
    blockEvents
  );
  await handleTipEvent(event, extrinsic, indexer);
  await handleMotionEvent(event, extrinsic, indexer, blockEvents);
  await handleReferendumEventWithExtrinsic(
    event,
    extrinsic,
    indexer,
    blockEvents
  );
  await handleTechCommMotionEvent(event, extrinsic, indexer, blockEvents);
  await handleDemocracyExternalEvent(event, extrinsic, indexer, blockEvents);
}

async function handleEventWithoutExtrinsic(
  indexer,
  event,
  eventSort,
  blockEvents
) {
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

    let indexer = {
      ...blockIndexer,
      eventIndex: sort,
    };
    let extrinsic;
    if (!phase.isNull) {
      const extrinsicIndex = phase.value.toNumber();
      indexer = {
        ...indexer,
        extrinsicIndex,
      };

      extrinsic = extrinsics[extrinsicIndex];
    }

    await handleTreasuryEvent(event, indexer, events, extrinsic);

    if (phase.isNull) {
      await handleEventWithoutExtrinsic(indexer, event, sort, events);
    } else {
      const extrinsicIndex = phase.value.toNumber();
      indexer.extrinsicIndex = extrinsicIndex;

      extrinsic = extrinsics[extrinsicIndex];
      await handleEventWithExtrinsic(
        blockIndexer,
        event,
        sort,
        extrinsic,
        extrinsicIndex,
        events
      );
    }

    await handleBountyEvent(event, indexer, extrinsic);
  }
}

module.exports = {
  handleEvents,
};
