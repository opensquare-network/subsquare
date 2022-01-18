const isNil = require("lodash.isnil");
const {
  updateDemocracyPublicProposal,
} = require("../../../../mongo/service/onchain/democracyPublicProposal");
const {
  business: {
    handleWrappedCall,
    consts: { Modules, DemocracyMethods, TimelineItemTypes },
  },
} = require("@subsquare/scan-common");
const { DemocracyEvents } = require("./constants");

async function getProposalIndex(fastTrackCall, signer, indexer, events) {
  let proposalIndex = null;
  await handleWrappedCall(fastTrackCall, signer, indexer, events, (call) => {
    const { section, method, args } = call;
    if (
      Modules.Democracy !== section ||
      DemocracyMethods.fastTrack !== method
    ) {
      return;
    }

    proposalIndex = args[0].toJSON();
  });

  return proposalIndex;
}

// fast_track is usually done by TC motion
async function handleFastTrack(event, indexer, extrinsic, events) {
  const eventData = event.data.toJSON();
  const [referendumIndex] = eventData;

  const proposalIndex = await getProposalIndex(
    extrinsic.method,
    extrinsic.singer?.toString(),
    indexer,
    events
  );
  if (isNil(proposalIndex)) {
    throw new Error(
      `can not find the proposal index from fast_track event for referendum ${referendumIndex}`
    );
  }

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: DemocracyEvents.FastTrack,
    args: {
      proposalIndex,
      referendumIndex,
    },
    indexer,
  };

  await updateDemocracyPublicProposal(proposalIndex, null, timelineItem);
}

module.exports = {
  handleFastTrack,
};
