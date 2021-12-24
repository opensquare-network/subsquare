// Only for karura
const { handleProposed } = require("./service/proposed");
const {
  env: { isKarura },
  business: {
    consts: { CollectiveEvents, KaruraModules },
  },
} = require("@subsquare/scan-common");

function isFinancialCouncilModule(section) {
  return isKarura() && KaruraModules.FinancialCouncil === section;
}

async function handleFinancialMotionEvent(
  event,
  indexer,
  blockEvents,
  extrinsic
) {
  const { section, method } = event;
  if (!isFinancialCouncilModule(section)) {
    return;
  }

  if (CollectiveEvents.Proposed === method) {
    await handleProposed(...arguments);
  }
}

module.exports = {
  handleFinancialMotionEvent,
};
