const {
  updateDemocracyPublicProposal,
} = require("../../../mongo/service/onchain/democracyPublicProposal");
const {
  publicProposalState,
  DemocracyEvents,
} = require("../democracy/publicProposal/constants");
const {
  insertReferendumWithPublicProposal,
} = require("../democracy/referendum/insert");
const { getTechCommMotionCollection } = require("../../../mongo");
const {
  updateTechCommMotionByHash,
} = require("../../../mongo/service/onchain/techCommMotion");
const {
  business: {
    getCollectiveExecutedCommonFields,
    consts: { Modules, ReferendumEvents, TimelineItemTypes },
  },
} = require("@subsquare/scan-common");

function findReferendumStarted(events) {
  return events.find(({ event: e }) => {
    return (
      e.section === Modules.Democracy && e.method === ReferendumEvents.Started
    );
  });
}

async function handleBusiness(motionHash, indexer, blockEvents) {
  const col = await getTechCommMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    throw new Error(
      `Not found executed tech.comm. motion:${motionHash} in DB at height ${indexer.blockHeight}`
    );
  }

  if ((motion.publicProposals || [].length).length < 1) {
    return;
  }

  const startedEvent = findReferendumStarted(blockEvents);
  if (!startedEvent) {
    throw new Error(
      `Can not find referendum started after TC motion fast track at ${indexer.blockHeight}`
    );
  }

  const { proposalIndex } = motion.publicProposals[0];
  const state = {
    indexer,
    state: publicProposalState.FastTracked,
  };

  const timelineTime = {
    type: TimelineItemTypes.event,
    method: DemocracyEvents.FastTrack,
    indexer,
  };

  await updateDemocracyPublicProposal(
    proposalIndex,
    {
      state,
      isFinal: true,
    },
    timelineTime
  );

  await insertReferendumWithPublicProposal(
    startedEvent.event,
    indexer,
    proposalIndex
  );
}

async function handleExecuted(event, indexer, extrinsic, blockEvents) {
  const { hash, isOk, updates, timelineItem } =
    await getCollectiveExecutedCommonFields(
      event,
      indexer,
      Modules.TechnicalCommittee
    );
  if (isOk) {
    await handleBusiness(hash, indexer, blockEvents);
  }
  await updateTechCommMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleExecuted,
};
