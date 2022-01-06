const { insertReferendumWithPublicProposal } = require("../referendum/insert");
const {
  updateDemocracyPublicProposal,
} = require("../../../../mongo/service/onchain/democracyPublicProposal");
const {
  business: {
    consts: {
      Modules,
      DemocracyPublicProposalEvents,
      ReferendumEvents,
      TimelineItemTypes,
    },
  },
} = require("@subsquare/scan-common");

function extractReferendumIndex(event) {
  const { section, method, data } = event.event || {};
  if (Modules.Democracy !== section || ReferendumEvents.Started !== method) {
    throw new Error("can not get referendum index when tabled");
  }

  const [referendumIndex] = data.toJSON();
  return referendumIndex;
}

async function handleProposal(indexer, event, sort, allEvents) {
  const eventData = event.data.toJSON();
  const [proposalIndex, deposit, depositors] = eventData;
  const referendumIndex = extractReferendumIndex(allEvents[sort + 1]);

  const state = {
    indexer,
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
    indexer,
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
  const proposalTabledEvent = allEvents[sort - 1].event;
  const [proposalIndex] = proposalTabledEvent.data.toJSON();
  await insertReferendumWithPublicProposal(event, blockIndexer, proposalIndex);
}

async function handleTabled(event, indexer, extrinsic, allEvents) {
  const { eventIndex: sort } = indexer;
  await handleProposal(indexer, event, sort, allEvents);
  const referendumStartedEvent = allEvents[sort + 1].event;
  await handleReferendum(indexer, referendumStartedEvent, sort + 1, allEvents);
}

module.exports = {
  handleTabled,
};
