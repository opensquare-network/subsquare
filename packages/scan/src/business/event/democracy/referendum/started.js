const {
  Modules,
  TechnicalCommitteeEvents,
} = require("../../../common/constants");
const {
  insertSoloReferendum,
} = require("../../../common/democracy/referendum/insert");

async function handleStarted(event, indexer, blockEvents = []) {
  const { eventIndex } = indexer;
  const maybeTechCommCloseEvent = blockEvents[eventIndex + 1];
  if (!maybeTechCommCloseEvent) {
    return;
  }

  const { section, method } = maybeTechCommCloseEvent.event;
  if (
    Modules.TechnicalCommittee === section &&
    TechnicalCommitteeEvents.Executed === method
  ) {
    // This referendum logic will be handled in the TechnicalCommittee#Executed handling method
    return;
  }

  const eventData = event.data.toJSON();
  const [, dispatchResult] = eventData;
  if (!Object.keys(dispatchResult).includes("ok")) {
    return;
  }

  await insertSoloReferendum(...arguments);
}

module.exports = {
  handleStarted,
};
