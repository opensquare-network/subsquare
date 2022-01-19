const { handleAwarded } = require("./awarded");
const { handleRejected } = require("./rejected");
const { handleProposed } = require("./proposed");
const {
  business: {
    consts: { TreasuryProposalEvents },
    isTreasuryProposalEvent,
  },
} = require("@subsquare/scan-common");

async function handleTreasuryEvent(event, indexer, events, extrinsic) {
  const { section, method } = event;
  if (!isTreasuryProposalEvent(section, method)) {
    return;
  }

  if (TreasuryProposalEvents.Proposed === method) {
    await handleProposed(...arguments);
  } else if (TreasuryProposalEvents.Rejected === method) {
    await handleRejected(...arguments);
  } else if (TreasuryProposalEvents.Awarded === method) {
    await handleAwarded(...arguments);
  }
}

module.exports = {
  handleTreasuryEvent,
};
