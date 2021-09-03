const {
  saveNewPublicProposal,
  handlePublicProposalTabled,
} = require("./store");
const {
  Modules,
  DemocracyPublicProposalEvents,
} = require("../../../common/constants");

function isPublicProposalEvent(section, method) {
  if (![Modules.Democracy].includes(section)) {
    return false;
  }

  return DemocracyPublicProposalEvents.hasOwnProperty(method);
}

async function handlePublicProposalEvent(event, extrinsic, indexer) {
  const { section, method } = event;
  if (!isPublicProposalEvent(section, method)) {
    return;
  }

  if (DemocracyPublicProposalEvents.Proposed === method) {
    await saveNewPublicProposal(...arguments);
  } else if (DemocracyPublicProposalEvents.Tabled === method) {
    await handlePublicProposalTabled(...arguments);
  }
}

module.exports = {
  handlePublicProposalEvent,
};
