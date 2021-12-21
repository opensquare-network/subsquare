const { insertBountyPost } = require("../../../mongo/service/business/bounty");
const { insertBounty } = require("../../../mongo/service/onchain/bounty");
const {
  log: { busLogger },
  business: {
    consts: { TimelineItemTypes, BountyMethods, BountyStatus },
    getBountyMeta,
    getBountyDescription,
  },
} = require("@subsquare/scan-common");

async function handleProposed(event, indexer, extrinsic) {
  const eventData = event.data.toJSON();
  const [bountyIndex] = eventData;

  if (!extrinsic) {
    throw new Error(
      `Can not find extrinsic with bounty proposed event ${JSON.stringify(
        indexer
      )}`
    );
  }

  const meta = await getBountyMeta(bountyIndex, indexer);
  const { proposer, value } = meta;
  const authors = [...new Set([proposer, extrinsic.signer.toString()])];
  const description = await getBountyDescription(bountyIndex, indexer);

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: BountyMethods.proposeBounty,
    args: {
      value,
      description,
    },
    indexer: indexer,
  };

  const state = {
    indexer,
    state: BountyStatus.Proposed,
    data: eventData,
  };

  const obj = {
    indexer,
    bountyIndex,
    authors,
    description,
    value,
    meta,
    state,
    timeline: [timelineItem],
  };

  await insertBounty(obj);
  await insertBountyPost(bountyIndex, description, proposer);
  busLogger.info(`Bounty #${bountyIndex} created`, indexer);
}

module.exports = {
  handleProposed,
};
