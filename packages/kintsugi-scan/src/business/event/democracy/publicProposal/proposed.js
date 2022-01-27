const {
  insertDemocracyPublicProposal,
} = require("../../../../mongo/service/onchain/democracyPublicProposal");
const {
  insertDemocracyPostByProposal,
} = require("../../../../mongo/service/business/democracy");
const {
  business: {
    consts: { DemocracyPublicProposalEvents, TimelineItemTypes },
    getPublicProposalFromStorage,
    getPublicProposalDeposit,
  },
} = require("@subsquare/scan-common");

async function saveNewPublicProposal(event, indexer, extrinsic) {
  const eventData = event.data.toJSON();
  const [proposalIndex] = eventData;
  const [, hash, proposer] = await getPublicProposalFromStorage(
    proposalIndex,
    indexer
  );
  const deposit = await getPublicProposalDeposit(proposalIndex, indexer);
  const authors = [...new Set([proposer, extrinsic.signer.toString()])];

  const state = {
    indexer,
    state: DemocracyPublicProposalEvents.Proposed,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: DemocracyPublicProposalEvents.Proposed,
    args: {
      index: proposalIndex,
      hash,
      proposer,
    },
    indexer,
    isFinal: false,
  };

  const obj = {
    indexer,
    proposalIndex,
    hash,
    authors,
    proposer,
    deposit,
    state,
    timeline: [timelineItem],
    techCommMotions: [],
  };

  await insertDemocracyPublicProposal(obj);
  await insertDemocracyPostByProposal(proposalIndex, indexer, proposer);
}

module.exports = {
  saveNewPublicProposal,
};
