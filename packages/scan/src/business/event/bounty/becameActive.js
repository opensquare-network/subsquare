const { updateBounty } = require("../../../mongo/service/onchain/bounty");
const {
  business: {
    consts: { TimelineItemTypes, BountyEvents, BountyStatus },
    getBountyMeta,
  },
} = require("@subsquare/scan-common");

async function handleBecameActive(event, indexer) {
  const eventData = event.data.toJSON();
  const [bountyIndex] = eventData;

  const meta = await getBountyMeta(bountyIndex, indexer);
  const timelineItem = {
    type: TimelineItemTypes.event,
    method: BountyEvents.BountyBecameActive,
    args: {
      bountyIndex,
    },
    indexer,
  };

  const state = {
    indexer,
    state: BountyStatus.Funded,
  };

  await updateBounty(bountyIndex, { state, meta }, timelineItem);
}

module.exports = {
  handleBecameActive,
};
