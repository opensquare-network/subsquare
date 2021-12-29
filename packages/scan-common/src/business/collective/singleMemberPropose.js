const { normalizeCall } = require("../common/call/normalize");
const { CollectiveEvents } = require("../common/constants");

function hasProposedEvent(extrinsicEvents) {
  return extrinsicEvents.some(
    ({ event }) => CollectiveEvents.Proposed === event.method
  );
}

function isSingleMemberCollectivePropose(call, extrinsicEvents) {
  const threshold = call.args[0].toNumber();
  if (threshold >= 2) {
    return false;
  }

  // If there is proposed event, we just handle it in event business handling, not here.
  return !hasProposedEvent(extrinsicEvents);
}

function extractCommonFieldsFromSinglePropose(
  call,
  signer,
  extrinsicIndexer,
  extrinsicEvents,
  moduleName
) {
  const threshold = call.args[0].toNumber();

  const executedEvent = extrinsicEvents.find(
    ({ event }) =>
      moduleName === event.section && CollectiveEvents.Executed === event.method
  );

  if (!executedEvent) {
    throw new Error(
      `No Executed event found in collective single propose at ${extrinsicIndexer.blockHeight}`
    );
  }

  const [motionHash] = executedEvent.event.data.toJSON();

  const proposalCall = call.args[1];
  const proposal = normalizeCall(proposalCall);

  return {
    indexer: extrinsicIndexer,
    hash: motionHash,
    proposer: signer,
    threshold,
    authors: [signer],
    proposal,
    isFinal: false,
    timeline: [],
  };
}

module.exports = {
  isSingleMemberCollectivePropose,
  extractCommonFieldsFromSinglePropose,
};
