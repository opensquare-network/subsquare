const { updateBounty } = require("../../../mongo/service/onchain/bounty");
const {
  BountyStatus,
  BountyEvents,
  TimelineItemTypes,
} = require("../../common/constants");
const { getBountyMetaByHeight } = require("../../common/bounty/meta");

async function handleCanceled(event, indexer) {
  const [bountyIndex] = event.data.toJSON();

  const meta = await getBountyMetaByHeight(
    bountyIndex,
    indexer.blockHeight - 1
  );
  const state = {
    indexer,
    state: BountyStatus.Canceled,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: BountyEvents.BountyCanceled,
    args: {},
    indexer: indexer,
  };

  await updateBounty(bountyIndex, { state, meta }, timelineItem);
}

module.exports = {
  handleCanceled,
};
