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

async function handleTreasuryProposalEvent(
  registry,
  event,
  extrinsic,
  indexer
) {
  const { section, method } = event;
  if (!isTreasuryProposalEvent(section, method)) {
    return;
  }

  if (TreasuryProposalEvents.Proposed === method) {
    await saveNewTreasuryProposal(...arguments);
  } else if (TreasuryProposalEvents.Rejected === method) {
    await handleTreasuryProposalRejected(...arguments);
  }
}

async function handleTreasuryProposalEventWithoutExtrinsic(
  registry,
  event,
  indexer // this indexer don't have extrinsic index
) {
  const { section, method } = event;
  if (!isTreasuryProposalEvent(section, method)) {
    return;
  }

  if (TreasuryProposalEvents.Awarded === method) {
    await handleTreasuryProposalAwarded(...arguments);
  }
}

module.exports = {
  handleTreasuryProposalEvent,
  handleTreasuryProposalEventWithoutExtrinsic,
};
