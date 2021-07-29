const { handleTipEvent } = require("./tip");

async function handleEvents(registry, events, extrinsics, blockIndexer) {
  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    if (phase.isNull) {
      return;
    }

    const extrinsicIndex = phase.value.toNumber();
    const extrinsic = extrinsics[extrinsicIndex];
    const indexer = {
      ...blockIndexer,
      eventIndex: sort,
      extrinsicIndex,
    };

    // TODO: handle business with events
    await handleTipEvent(registry, event, extrinsic, indexer);
  }
}

module.exports = {
  handleEvents,
};
