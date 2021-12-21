const { getPublicProposalFromStorage } = require("./storage");
const {
  insertDemocracyPublicProposal,
} = require("../../../../mongo/service/onchain/democracyPublicProposal");
const {
  insertDemocracyPostByProposal,
} = require("../../../../mongo/service/business/democracy");
const {
  business: {
    consts: { DemocracyPublicProposalEvents, TimelineItemTypes },
  },
} = require("@subsquare/scan-common");

async function saveNewPublicProposal(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [proposalIndex] = eventData;
  const [, hash, proposer] = await getPublicProposalFromStorage(
    proposalIndex,
    indexer
  );
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
  };

  const obj = {
    indexer,
    proposalIndex,
    hash,
    authors,
    proposer,
    state,
    timeline: [timelineItem],
  };

  await insertDemocracyPublicProposal(obj);
  await insertDemocracyPostByProposal(proposalIndex, indexer, proposer);
}

module.exports = {
  saveNewPublicProposal,
};
