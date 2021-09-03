const { handlePublicProposalEvent } = require("./publicProposal");

async function handleDemocracyEvent(event, extrinsic, indexer) {
  await handlePublicProposalEvent(...arguments);
}

module.exports = {
  handlePublicProposalEvent,
};
