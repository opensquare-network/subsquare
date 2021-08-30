const {
  insertTreasuryProposalPost,
} = require("../../../mongo/service/business/treasuryProposal");
const {
  insertTreasuryProposal,
} = require("../../../mongo/service/treasuryProposal");
const {
  TimelineItemTypes,
  TreasuryProposalEvents,
} = require("../../common/constants");
const {
  getTreasuryProposalMeta,
} = require("../../common/treasuryProposal/meta");

async function saveNewTreasuryProposal(
  registry,
  event,
  extrinsic,
  eventIndexer
) {
  const [proposalIndex] = event.data.toJSON();

  const meta = await getTreasuryProposalMeta(
    eventIndexer.blockHash,
    proposalIndex
  );
  const { proposer, value, beneficiary } = meta;

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: TreasuryProposalEvents.Proposed,
    args: {
      index: proposalIndex,
    },
    indexer: eventIndexer,
  };

  const state = {
    indexer: eventIndexer,
    state: TreasuryProposalEvents.Proposed,
    data: event.data.toJSON(),
  };

  const obj = {
    indexer: eventIndexer,
    proposalIndex,
    proposer,
    value,
    beneficiary,
    meta,
    state,
    timeline: [timelineItem],
  };

  await insertTreasuryProposal(obj);
  await insertTreasuryProposalPost(proposalIndex);
}

module.exports = {
  saveNewTreasuryProposal,
};
