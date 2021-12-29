const { saveNewPublicProposal } = require("./proposed");
const {
  business: {
    consts: { Modules, DemocracyPublicProposalEvents },
  },
} = require("@subsquare/scan-common");

function isPublicProposalEvent(section, method) {
  if (![Modules.Democracy].includes(section)) {
    return false;
  }

  return DemocracyPublicProposalEvents.hasOwnProperty(method);
}

async function handleDemocracyEvent(event, indexer, extrinsic, blockEvents) {
  const { section, method } = event;
  if (isPublicProposalEvent(section, method)) {
    await saveNewPublicProposal(event, extrinsic, indexer);
  }
}

module.exports = {
  handleDemocracyEvent,
};
