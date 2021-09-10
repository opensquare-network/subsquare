const {
  insertDemocracyReferendum,
} = require("../../../../../mongo/service/onchain/democracyReferendum");
const {
  getReferendumInfoFromStorage,
} = require("../../../democracy/common/referendumStorage");
const {
  updateDemocracyExternalByHash,
} = require("../../../../../mongo/service/onchain/democracyExternal");
const {
  Modules,
  ReferendumEvents,
  DemocracyExternalStates,
  TimelineItemTypes,
} = require("../../../../common/constants");
const { getTechCommMotionCollection } = require("../../../../../mongo");

async function handleBusinessWhenTechCommMotionExecuted(
  motionHash,
  indexer,
  extrinsicEvents
) {
  const col = await getTechCommMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    throw new Error(
      `Not found executed tech.comm. motion:${motionHash} in DB at height ${indexer.blockHeight}`
    );
  }

  const { isDemocracy, externalProposalHash, proposal } = motion;
  if (!isDemocracy) {
    return;
  }

  if (!hasReferendumStarted(extrinsicEvents)) {
    throw new Error(
      "Tech. Comm. motion to fastTrack not table externalProposal"
    );
  }

  const referendumStartedEvent = extrinsicEvents.find(
    ({ event }) =>
      event.section === Modules.Democracy &&
      event.method === ReferendumEvents.Started
  );

  const eventData = referendumStartedEvent.event.data.toJSON();
  const [referendumIndex, threshold] = eventData;

  const externalState = {
    indexer,
    state: DemocracyExternalStates.Tabled,
  };

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: proposal.method,
    args: proposal.args,
    indexer,
  };

  await updateDemocracyExternalByHash(
    externalProposalHash,
    {
      state: externalState,
      isFinal: true,
      referendumIndex,
    },
    timelineItem
  );

  const referendumInfo = await getReferendumInfoFromStorage(
    referendumIndex,
    indexer
  );
  const state = {
    indexer,
    state: ReferendumEvents.Started,
    data: eventData,
  };

  const referendumTimelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: ReferendumEvents.Started,
    args: {
      referendumIndex,
      voteThreshold: threshold,
    },
    indexer,
  };

  const obj = {
    indexer,
    referendumIndex,
    info: referendumInfo,
    externalProposalHash, // FIXME: external hash is not unique, we should find another id.
    state,
    timeline: [referendumTimelineItem],
  };

  await insertDemocracyReferendum(obj);
}

function hasReferendumStarted(events) {
  return events.some(({ event: e }) => {
    return (
      e.section === Modules.Democracy && e.method === ReferendumEvents.Started
    );
  });
}

module.exports = {
  handleBusinessWhenTechCommMotionExecuted,
};
