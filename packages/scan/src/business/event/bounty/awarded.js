const { updateBounty } = require("../../../mongo/service/onchain/bounty");
const {
  BountyEvents,
  TimelineItemTypes,
  BountyStatus,
} = require("../../common/constants");
const { getBountyMeta } = require("../../common/bounty/meta");

async function handleAwarded(event, indexer) {
  const eventData = event.data.toJSON();
  const [bountyIndex, beneficiary] = eventData;

  const meta = await getBountyMeta(bountyIndex, indexer);
  const timelineItem = {
    type: TimelineItemTypes.event,
    method: BountyEvents.BountyAwarded,
    args: {
      beneficiary,
    },
    indexer,
  };

  const state = {
    indexer,
    state: BountyStatus.PendingPayout,
  };

  await updateBounty(bountyIndex, { state, meta }, timelineItem);
}

module.exports = {
  handleAwarded,
};
