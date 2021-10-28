const { updateBounty } = require("../../../mongo/service/onchain/bounty");
const { getBountyMeta } = require("../../common/bounty/meta");
const {
  Modules,
  BountyMethods,
  TimelineItemTypes,
  BountyStatus,
} = require("../../common/constants");

function isBountyModule(section) {
  return [Modules.Treasury, Modules.Bounties].includes(section);
}

async function handleAcceptCurator(call, caller, extrinsicIndexer) {
  if (
    !isBountyModule(call.section) ||
    BountyMethods.acceptCurator !== call.method
  ) {
    return;
  }

  const { bounty_id: bountyIndex } = call.toJSON().args;
  const meta = await getBountyMeta(bountyIndex, extrinsicIndexer);

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: call.method,
    args: {
      curator: caller,
    },
    extrinsicIndexer,
  };

  const state = {
    indexer: extrinsicIndexer,
    state: BountyStatus.Active,
  };

  await updateBounty(bountyIndex, { state, meta }, timelineItem);
}

module.exports = {
  handleAcceptCurator,
};
