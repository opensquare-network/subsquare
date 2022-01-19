const { Modules, TreasuryProposalEvents } = require("../common/constants");

function isTreasuryProposalEvent(section, method) {
  if (![Modules.Treasury].includes(section)) {
    return false;
  }

  return TreasuryProposalEvents.hasOwnProperty(method);
}

module.exports = {
  isTreasuryProposalEvent,
};
