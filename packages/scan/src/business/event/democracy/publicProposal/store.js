const {
  insertDemocracyPublicProposalPost,
} = require("../../../../mongo/service/business/democracyPublicProposal");
const {
  insertDemocracyPublicProposal,
  updateDemocracyPublicProposal,
} = require("../../../../mongo/service/onchain/democracyPublicProposal");
const { TimelineItemTypes } = require("../../../common/constants");
const {
  Modules,
  DemocracyPublicProposalEvents,
  ReferendumEvents,
} = require("../../../common/constants");
const { getApi } = require("../../../../api");
const { expandMetadata } = require("@polkadot/types");
const { findMetadata } = require("../../../../specs");

function isPublicProposalEvent(section, method) {
  if (![Modules.Democracy].includes(section)) {
    return false;
  }

  return DemocracyPublicProposalEvents.hasOwnProperty(method);
}

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
  const { section, method } = event;
  if (!isPublicProposalEvent(section, method)) {
    return;
  }
  if (DemocracyPublicProposalEvents.Proposed !== method) {
    return;
  }

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

function extractReferendumIndex(event) {
  const { section, method, data } = event.event || {};
  if (Modules.Democracy !== section || ReferendumEvents.Started !== method) {
    throw new Error("can not get referendum index when tabled");
  }

  const [referendumIndex] = data.toJSON();
  return referendumIndex;
}

async function handlePublicProposalTabled(
  blockIndexer,
  event,
  sort,
  allEvents
) {
  const { section, method } = event;
  if (!isPublicProposalEvent(section, method)) {
    return;
  }

  if (DemocracyPublicProposalEvents.Tabled !== method) {
    return;
  }

  const eventData = event.data.toJSON();
  const [proposalIndex, deposit, depositors] = eventData;
  const referendumIndex = extractReferendumIndex(allEvents[sort + 1]);

  const state = {
    indexer: blockIndexer,
    state: DemocracyPublicProposalEvents.Tabled,
    data: eventData,
  };

  const timelineTime = {
    type: TimelineItemTypes.event,
    method: DemocracyPublicProposalEvents.Tabled,
    args: {
      referendumIndex,
      deposit,
      depositors,
    },
    indexer: blockIndexer,
  };

  await updateDemocracyPublicProposal(
    proposalIndex,
    {
      referendumIndex,
      state,
    },
    timelineTime
  );
}

module.exports = {
  saveNewPublicProposal,
  handlePublicProposalTabled,
  getPublicProposalFromStorage,
};
