const { handleTechCommPropose } = require("./tc/propose");
const { handleSecond } = require("./democracy/second");
const {
  business: { handleWrappedCall },
  utils: { isExtrinsicSuccess, extractExtrinsicEvents },
} = require("@subsquare/scan-common");

async function handleExtrinsics(extrinsics = [], allEvents = [], blockIndexer) {
  let index = 0;
  for (const extrinsic of extrinsics) {
    const events = extractExtrinsicEvents(allEvents, index);
    if (!isExtrinsicSuccess(events)) {
      continue;
    }

    const extrinsicIndexer = { ...blockIndexer, index: index++ };
    await handleWrappedCall(
      extrinsic.method,
      extrinsic.signer?.toString(),
      extrinsicIndexer,
      allEvents,
      async (call, signer, indexer, events) => {
        await handleTechCommPropose(call, signer, indexer, events);
        await handleSecond(call, signer, indexer, events);
      }
    );
  }
}

module.exports = {
  handleExtrinsics,
};
