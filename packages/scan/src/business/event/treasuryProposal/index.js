const {
  saveNewTreasuryProposal,
  handleTreasuryProposalAwarded,
  handleTreasuryProposalRejected,
} = require("./store");
const { Modules, TreasuryProposalEvents } = require("../../common/constants");

function isTreasuryProposalEvent(section, method) {
  if (![Modules.Treasury].includes(section)) {
    return false;
  }

  return TreasuryProposalEvents.hasOwnProperty(method);
}

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
