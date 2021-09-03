const {
  insertDemocracyPublicProposalPost,
} = require("../../../../mongo/service/business/democracyPublicProposal");
const {
  insertDemocracyPublicProposal,
} = require("../../../../mongo/service/onchain/democracyPublicProposal");
const { TimelineItemTypes } = require("../../../common/constants");
const { DemocracyPublicProposalEvents } = require("../../../common/constants");
const { getApi } = require("../../../../api");
const { expandMetadata } = require("@polkadot/types");
const { findMetadata } = require("../../../../specs");

async function getPublicProposalFromStorage(proposalIndex, indexer) {
  const metadata = await findMetadata(indexer.blockHeight);
  const decorated = expandMetadata(metadata.registry, metadata);
  const key = [decorated.query.democracy.publicProps];

  const api = await getApi();
  const rawMeta = await api.rpc.state.getStorage(key, indexer.blockHash);
  const allProposals = rawMeta.toJSON() || [];
  return allProposals.find(([index]) => index === proposalIndex);
}

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
  await insertDemocracyPublicProposalPost(obj);
}

async function handlePublicProposalTabled(event, extrinsic, indexer) {
  //TODO: handle the Tabled event
}

module.exports = {
  saveNewPublicProposal,
  handlePublicProposalTabled,
  getPublicProposalFromStorage,
};
