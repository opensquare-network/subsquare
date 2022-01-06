const { handleExecuted } = require("./executed");
const {
  business: {
    consts: { Modules, TechnicalCommitteeEvents },
  },
} = require("@subsquare/scan-common");

function isTechCommModule(section) {
  return Modules.TechnicalCommittee === section;
}

async function handleTechCommMotionEvent(
  event,
  indexer,
  extrinsic,
  extrinsicEvents
) {
  const { section, method } = event;
  if (!isTechCommModule(section)) {
    return;
  }

  if (TechnicalCommitteeEvents.Executed === method) {
    await handleExecuted(...arguments);
  }
}

module.exports = {
  handleTechCommMotionEvent,
};
