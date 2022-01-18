const { handleTabled } = require("./tabled");
// const { handleFastTrack } = require("./fastTrack");
const { saveNewPublicProposal } = require("./proposed");
const {
  business: {
    consts: { Modules },
  },
} = require("@subsquare/scan-common");
const { DemocracyEvents } = require("./constants");

function isPublicProposalEvent(section, method) {
  if (![Modules.Democracy].includes(section)) {
    return false;
  }

  return DemocracyEvents.hasOwnProperty(method);
}

async function handleDemocracyEvent(event, indexer, extrinsic, blockEvents) {
  const { section, method } = event;
  if (!isPublicProposalEvent(section, method)) {
    return;
  }

  if (DemocracyEvents.Proposed === method) {
    await saveNewPublicProposal(event, indexer, extrinsic, blockEvents);
  } else if (DemocracyEvents.FastTrack === method) {
    // await handleFastTrack(event, indexer, extrinsic, blockEvents);
  } else if (DemocracyEvents.Tabled === method) {
    await handleTabled(event, indexer, extrinsic, blockEvents);
  }
}

module.exports = {
  handleDemocracyEvent,
};
