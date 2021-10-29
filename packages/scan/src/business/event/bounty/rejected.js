const { updateBounty } = require("../../../mongo/service/onchain/bounty");
const {
  TimelineItemTypes,
  BountyStatus,
  BountyEvents,
} = require("../../common/constants");
const { getBountyMetaByHeight } = require("../../common/bounty/meta");

async function handleRejected(event, indexer) {
  const [bountyIndex, slashed] = event.data.toJSON();

  const meta = await getBountyMetaByHeight(
    bountyIndex,
    indexer.blockHeight - 1
  );
  const state = {
    indexer,
    state: BountyStatus.Rejected,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: BountyEvents.BountyRejected,
    args: {
      slashed,
    },
    indexer: indexer,
  };

  await updateBounty(bountyIndex, { state, meta }, timelineItem);
}

module.exports = {
  handleRejected,
};
