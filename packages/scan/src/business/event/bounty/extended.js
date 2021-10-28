const { updateBounty } = require("../../../mongo/service/onchain/bounty");
const {
  Modules,
  BountyMethods,
  TimelineItemTypes,
} = require("../../common/constants");
const { findCallInSections } = require("../../common/call/findCall");
const { getRealCaller } = require("../../common/call/getRealCaller");
const { getBountyMeta } = require("../../common/bounty/meta");
const { hexToString } = require("@polkadot/util");

async function handleExtended(event, indexer, extrinsic) {
  const eventData = event.data.toJSON();
  const [bountyIndex] = eventData;

  if (!extrinsic) {
    throw new Error(
      `Can not find extrinsic with bounty extended event ${JSON.stringify(
        indexer
      )}`
    );
  }

  const meta = await getBountyMeta(bountyIndex, indexer);

  const caller = getRealCaller(extrinsic.method, extrinsic.signer.toString());
  const call = findCallInSections(
    extrinsic.method,
    [Modules.Treasury, Modules.Bounties],
    BountyMethods.extendBountyExpiry
  );

  if (!call) {
    throw new Error(
      `can not find target ${BountyMethods.extendBountyExpiry} call`
    );
  }

  const { _remark: remark } = call.toJSON().args;

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args: {
      caller,
      remark: hexToString(remark),
    },
    indexer,
  };

  await updateBounty(bountyIndex, { meta }, timelineItem);
}

module.exports = {
  handleExtended,
};
