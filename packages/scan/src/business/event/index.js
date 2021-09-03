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
  registry,
  blockIndexer,
  event,
  eventSort,
  extrinsic,
  extrinsicIndex
) {
  const indexer = {
    ...blockIndexer,
    eventIndex: eventSort,
    extrinsicIndex,
  };

  await saveNewPublicProposal(event, extrinsic, indexer);
  await handleTipEvent(registry, event, extrinsic, indexer);
  await handleTreasuryProposalEvent(registry, event, extrinsic, indexer);
  await handleMotionEvent(registry, event, extrinsic, indexer);
}

async function handleEventWithoutExtrinsic(
  registry,
  blockIndexer,
  event,
  eventSort
) {
  const indexer = {
    ...blockIndexer,
    eventIndex: eventSort,
  };

  await handleTreasuryProposalEventWithoutExtrinsic(registry, event, indexer);
}

async function handleEvents(registry, events, extrinsics, blockIndexer) {
  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    if (phase.isNull) {
      await handleEventWithoutExtrinsic(registry, blockIndexer, event, sort);
      await handlePublicProposalTabled(blockIndexer, event, sort, events);
      continue;
    }

    const extrinsicIndex = phase.value.toNumber();
    const extrinsic = extrinsics[extrinsicIndex];
    await handleEventWithExtrinsic(
      registry,
      blockIndexer,
      event,
      sort,
      extrinsic,
      extrinsicIndex
    );
  }
}

module.exports = {
  handleEvents,
};
