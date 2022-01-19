const {
  saveNewTreasuryProposal,
  handleTreasuryProposalAwarded,
  handleTreasuryProposalRejected,
} = require("./store");
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
    await saveNewTreasuryProposal(...arguments);
  } else if (TreasuryProposalEvents.Rejected === method) {
    await handleTreasuryProposalRejected(...arguments);
  } else if (TreasuryProposalEvents.Awarded === method) {
    await handleTreasuryProposalAwarded(...arguments);
  }
}

module.exports = {
  handleTreasuryEvent,
};
