const { handleVetoed } = require("./vetoed");
const {
  Modules,
  DemocracyExternalEvents,
} = require("../../../common/constants");

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

module.exports = {
  handleDemocracyExternalEvent,
};
