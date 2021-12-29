const { handleDisApproved } = require("./service/disApproved");
const { handleExecuted } = require("./service/executed");
const { handleApproved } = require("./service/approved");
const { handleClosed } = require("./service/closed");
const { handleVoted } = require("./service/voted");
const { handleProposed } = require("./service/proposed");
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
  extrinsic,
  indexer,
  extrinsicEvents
) {
  const { section, method } = event;
  if (!isTechCommModule(section)) {
    return;
  }

  if (TechnicalCommitteeEvents.Proposed === method) {
    await handleProposed(...arguments);
  } else if (TechnicalCommitteeEvents.Voted === method) {
    await handleVoted(...arguments);
  } else if (TechnicalCommitteeEvents.Closed === method) {
    await handleClosed(...arguments);
  } else if (TechnicalCommitteeEvents.Approved === method) {
    await handleApproved(...arguments);
  } else if (TechnicalCommitteeEvents.Disapproved === method) {
    await handleDisApproved(...arguments);
  } else if (TechnicalCommitteeEvents.Executed === method) {
    await handleExecuted(...arguments);
  }
}

module.exports = {
  handleTechCommMotionEvent,
};
