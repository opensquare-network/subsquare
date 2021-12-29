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

    await handlePreImageEvent(event, indexer, events, extrinsic);
    await handleDemocracyEvent(event, indexer, events, extrinsic);
  }
}

module.exports = {
  handleEvents,
};
