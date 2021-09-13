const { handlePublicProposalTabled } = require("./tabled");
const { saveNewPublicProposal } = require("./proposed");
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

async function handleDemocracyPublicProposalEvent(
  event,
  extrinsic,
  indexer,
  blockEvents
) {
  const { section, method } = event;
  if (!isPublicProposalEvent(section, method)) {
    return;
  }

  if (DemocracyPublicProposalEvents.Proposed === method) {
    await saveNewPublicProposal(...arguments);
  }
}

async function handleDemocracyPublicProposalEventWithoutExtrinsic(
  event,
  indexer,
  blockEvents
) {
  const { section, method } = event;
  if (!isPublicProposalEvent(section, method)) {
    return;
  }

  if (DemocracyPublicProposalEvents.Tabled === method) {
    await handlePublicProposalTabled(...arguments);
  }
}

module.exports = {
  handleDemocracyPublicProposalEvent,
  handleDemocracyPublicProposalEventWithoutExtrinsic,
};
