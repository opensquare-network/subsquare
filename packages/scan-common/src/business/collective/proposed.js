const { CollectiveEvents, TimelineItemTypes } = require("../common/constants");
const { getCollectiveVoting } = require("../common/collective/voting");
const { normalizeCall } = require("../common/call/normalize");
const { getCollectiveMotionCall } = require("../common/collective/proposal");

async function getCollectiveMotionCommonFields(
  event,
  indexer,
  extrinsic,
  moduleName
) {
  const eventData = event.data.toJSON();
  const [proposer, motionIndex, hash, threshold] = eventData;
  const authors = [...new Set([proposer, extrinsic.signer.toString()])];

  const rawProposal = await getCollectiveMotionCall(hash, indexer, moduleName);
  const proposal = normalizeCall(rawProposal);
  const voting = await getCollectiveVoting(hash, indexer, moduleName);

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CollectiveEvents.Proposed,
    args: {
      proposer,
      index: motionIndex,
      hash,
      threshold,
    },
    indexer,
  };

  const state = {
    indexer,
    state: CollectiveEvents.Proposed,
    data: eventData,
  };

  const common = {
    indexer,
    hash,
    proposer,
    index: motionIndex,
    threshold,
    authors,
    proposal,
    voting,
    isFinal: false,
    state,
    timeline: [timelineItem],
  };

  return {
    common,
    rawProposal,
  };
}

module.exports = {
  getCollectiveMotionCommonFields,
};
