const { handleExternalTabled } = require("./externalTabled");
const { handleVetoed } = require("./vetoed");
const {
  business: {
    consts: { Modules, DemocracyExternalEvents },
  },
} = require("@subsquare/scan-common");

async function handleDemocracyExternalEvent(event, extrinsic, indexer) {
  const { section, method } = event;

  if (
    Modules.Democracy !== section ||
    DemocracyExternalEvents.Vetoed !== method
  ) {
    return;
  }

  await handleVetoed(...arguments);
}

async function handleDemocracyExternalEventNoExtrinsic(
  event,
  eventIndexer,
  blockEvents
) {
  const { section, method } = event;
  if (
    Modules.Democracy !== section ||
    DemocracyExternalEvents.ExternalTabled !== method
  ) {
    return;
  }

  await handleExternalTabled(...arguments);
}

module.exports = {
  handleDemocracyExternalEvent,
  handleDemocracyExternalEventNoExtrinsic,
};
