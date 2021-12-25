// Only for karura
const { handleExecuted } = require("./service/executed");
const { handleDisApproved } = require("./service/disApproved");
const { handleApproved } = require("./service/approved");
const { handleClosed } = require("./service/closed");
const { handleVoted } = require("./service/voted");
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
  } else if (CollectiveEvents.Voted === method) {
    await handleVoted(event, indexer);
  } else if (CollectiveEvents.Closed === method) {
    await handleClosed(event, indexer);
  } else if (CollectiveEvents.Approved === method) {
    await handleApproved(event, indexer);
  } else if (CollectiveEvents.Disapproved === method) {
    await handleDisApproved(event, indexer);
  } else if (CollectiveEvents.Executed === method) {
    await handleExecuted(event, indexer);
  }
}

module.exports = {
  handleFinancialMotionEvent,
};
