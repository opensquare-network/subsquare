const { handleProposed } = require("./store/proposed");
const { handleVoted } = require("./store/voted");
const { handleClosed } = require("./store/closed");
const { handleApproved } = require("./store/approved");
const { handleDisApproved } = require("./store/disApproved");
const { handleExecuted } = require("./store/executed");
const {
  env: { isKarura },
  business: {
    consts: { Modules, CouncilEvents, KaruraModules },
  },
} = require("@subsquare/scan-common");

function isCouncilModule(section) {
  if (isKarura()) {
    return KaruraModules.GeneralCouncil === section;
  }

  return Modules.Council === section;
}

async function handleMotionEvent(event, extrinsic, indexer, blockEvents) {
  const { section, method } = event;
  if (!isCouncilModule(section)) {
    return;
  }

  if (CouncilEvents.Proposed === method) {
    await handleProposed(...arguments);
  } else if (CouncilEvents.Voted === method) {
    await handleVoted(...arguments);
  } else if (CouncilEvents.Closed === method) {
    await handleClosed(...arguments);
  } else if (CouncilEvents.Approved === method) {
    await handleApproved(...arguments);
  } else if (CouncilEvents.Disapproved === method) {
    await handleDisApproved(...arguments);
  } else if (CouncilEvents.Executed === method) {
    await handleExecuted(...arguments);
  }
}

module.exports = {
  handleMotionEvent,
};
