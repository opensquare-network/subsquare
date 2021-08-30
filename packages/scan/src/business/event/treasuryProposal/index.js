const { saveNewTreasuryProposal } = require("./store");
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
  const { section, method, data } = event;
  if (!isTreasuryProposalEvent(section, method)) {
    return;
  }

  if (TreasuryProposalEvents.Proposed === method) {
    await saveNewTreasuryProposal(...arguments);
  } else if (TreasuryProposalEvents.Awarded === method) {
    //  Handle awarded
  } else if (TreasuryProposalEvents.Rejected === method) {
    //  Handle rejected
  }
}

module.exports = {
  handleTreasuryProposalEvent,
};
