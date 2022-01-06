const {
  insertReferendumPostSolo,
  updateOrCreatePostByReferendumWithProposal,
} = require("../../../../mongo/service/business/democracy");
const {
  updateDemocracyPublicProposal,
} = require("../../../../mongo/service/onchain/democracyPublicProposal");
const {
  insertDemocracyReferendum,
} = require("../../../../mongo/service/onchain/democracyReferendum");
const {
  business: {
    consts: { ReferendumEvents, TimelineItemTypes },
    getReferendumInfoFromStorage,
  },
} = require("@subsquare/scan-common");

async function _extractCommonData(referendumStartedEvent, indexer) {
  const eventData = referendumStartedEvent.data.toJSON();
  const [referendumIndex, threshold] = eventData;

  const referendumInfo = await getReferendumInfoFromStorage(
    referendumIndex,
    indexer
  );

  const state = {
    indexer,
    state: ReferendumEvents.Started,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.Started,
    args: {
      referendumIndex,
      voteThreshold: threshold,
    },
    indexer,
  };

  return {
    indexer,
    referendumIndex,
    info: referendumInfo,
    state,
    timeline: [timelineItem],
  };
}

async function insertReferendumWithPublicProposal(
  referendumStartedEvent,
  indexer,
  publicProposalIndex
) {
  const commonObj = await _extractCommonData(referendumStartedEvent, indexer);
  const obj = {
    ...commonObj,
    publicProposalIndex,
  };

  await insertDemocracyReferendum(obj);
  await updateDemocracyPublicProposal(publicProposalIndex, {
    referendumIndex: commonObj.referendumIndex,
  });

  await updateOrCreatePostByReferendumWithProposal(
    publicProposalIndex,
    commonObj.referendumIndex,
    indexer
  );
}

async function insertSoloReferendum(referendumStartedEvent, indexer) {
  const commonObj = await _extractCommonData(referendumStartedEvent, indexer);
  await insertDemocracyReferendum(commonObj);
  await insertReferendumPostSolo(commonObj.referendumIndex);
}

module.exports = {
  insertReferendumWithPublicProposal,
  insertSoloReferendum,
};
