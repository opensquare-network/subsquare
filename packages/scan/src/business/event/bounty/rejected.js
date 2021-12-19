const { updateBounty } = require("../../../mongo/service/onchain/bounty");
const { getBountyMetaByHeight } = require("../../common/bounty/meta");
const {
  business: {
    consts: { TimelineItemTypes, BountyStatus, BountyEvents },
  },
} = require("@subsquare/scan-common");

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
