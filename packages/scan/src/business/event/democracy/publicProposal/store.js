const { getReferendumInfoFromStorage } = require("../common/referendumStorage");
const {
  insertDemocracyPostByProposal,
  updateOrCreatePostByReferendumWithProposal,
} = require("../../../../mongo/service/business/democracy");
const { getPublicProposalFromStorage } = require("./storage");
const {
  insertDemocracyReferendum,
} = require("../../../../mongo/service/onchain/democracyReferendum");
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

function isPublicProposalEvent(section, method) {
  if (![Modules.Democracy].includes(section)) {
    return false;
  }

  return DemocracyPublicProposalEvents.hasOwnProperty(method);
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
  await insertDemocracyPostByProposal(proposalIndex);
}

function extractReferendumIndex(event) {
  const { section, method, data } = event.event || {};
  if (Modules.Democracy !== section || ReferendumEvents.Started !== method) {
    throw new Error("can not get referendum index when tabled");
  }

  const [referendumIndex] = data.toJSON();
  return referendumIndex;
}

async function handlePublicProposalTabled(event, indexer, allEvents) {
  const { section, method } = event;
  if (!isPublicProposalEvent(section, method)) {
    return;
  }

  if (DemocracyPublicProposalEvents.Tabled !== method) {
    return;
  }

  const { eventIndex: sort } = indexer;
  await handleProposal(indexer, event, sort, allEvents);
  const referendumStartedEvent = allEvents[sort + 1].event;
  await handleReferendum(indexer, referendumStartedEvent, sort + 1, allEvents);
}

async function handleProposal(blockIndexer, event, sort, allEvents) {
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

async function handleReferendum(blockIndexer, event, sort, allEvents) {
  const eventData = event.data.toJSON();
  const [referendumIndex, voteThreshold] = eventData;

  const proposalTabledEvent = allEvents[sort - 1].event;
  const [proposalIndex] = proposalTabledEvent.data.toJSON();

  const referendumInfo = await getReferendumInfoFromStorage(
    referendumIndex,
    blockIndexer
  );

  const state = {
    indexer: blockIndexer,
    state: ReferendumEvents.Started,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.Started,
    args: {
      proposalIndex,
      referendumIndex,
      voteThreshold,
    },
    indexer: blockIndexer,
  };

  const obj = {
    indexer: blockIndexer,
    proposalIndex,
    referendumIndex,
    info: referendumInfo,
    state,
    timeline: [timelineItem],
  };

  await insertDemocracyReferendum(obj);
  await updateOrCreatePostByReferendumWithProposal(
    proposalIndex,
    referendumIndex
  );
}

module.exports = {
  saveNewPublicProposal,
  handlePublicProposalTabled,
};
