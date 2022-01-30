const {
  updateDemocracyPublicProposal,
} = require("../../../mongo/service/onchain/democracyPublicProposal");
const {
  business: {
    consts: {
      Modules,
      TimelineItemTypes,
      DemocracyMethods,
      DemocracyPublicProposalEvents,
    },
  },
} = require("@subsquare/scan-common");

async function handleCancelProposal(call, signer, extrinsicIndexer) {
  if (
    Modules.Democracy !== call.section ||
    DemocracyMethods.cancelProposal !== call.method
  ) {
    return;
  }

  const proposalIndex = call.args[0].toNumber();

  const state = {
    state: DemocracyPublicProposalEvents.Canceled,
    indexer: extrinsicIndexer,
  };

  const timelineTime = {
    type: TimelineItemTypes.extrinsic,
    method: DemocracyMethods.cancelProposal,
    args: {},
    indexer: extrinsicIndexer,
  };

  await updateDemocracyPublicProposal(
    proposalIndex,
    {
      state,
    },
    timelineTime
  );
}

module.exports = {
  handleCancelProposal,
};
