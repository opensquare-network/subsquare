const { handleTreasuryEvent } = require("./treasuryProposal");
const { handleReferendumEvent } = require("./democracy/referendum");
const { handleTechCommMotionEvent } = require("./tc");
const { handleDemocracyEvent } = require("./democracy/publicProposal");
const { handlePreImageEvent } = require("./democracy/preimage");

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

    await handlePreImageEvent(event, indexer);
    await handleDemocracyEvent(event, indexer, extrinsic, events);
    await handleTechCommMotionEvent(event, indexer, extrinsic, events);
    await handleReferendumEvent(event, indexer, extrinsic, events);
    await handleTreasuryEvent(event, indexer, events, extrinsic);
  }
}

module.exports = {
  handleEvents,
};
