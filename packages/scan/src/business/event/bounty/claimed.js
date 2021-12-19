const { updateBounty } = require("../../../mongo/service/onchain/bounty");
const { getBountyMetaByHeight } = require("../../common/bounty/meta");
const {
  business: {
    consts: { BountyStatus, TimelineItemTypes, BountyEvents },
  },
} = require("@subsquare/scan-common");

async function handleClaimed(event, indexer) {
  const [bountyIndex, payout, beneficiary] = event.data.toJSON();

  const meta = await getBountyMetaByHeight(
    bountyIndex,
    indexer.blockHeight - 1
  );
  const state = {
    indexer,
    state: BountyStatus.Claimed,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: BountyEvents.BountyClaimed,
    args: {
      beneficiary,
      payout,
    },
    indexer: indexer,
  };

  await updateBounty(bountyIndex, { state, meta }, timelineItem);
}

module.exports = {
  handleClaimed,
};
