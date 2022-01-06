const {
  updateDemocracyPublicProposal,
} = require("../../../mongo/service/onchain/democracyPublicProposal");
const {
  insertTechCommMotionPost,
} = require("../../../mongo/service/business/techCommMotion");
const {
  insertTechCommMotion,
} = require("../../../mongo/service/onchain/techCommMotion");
const { extractPublicProposals } = require("./business");
const {
  business: {
    consts: {
      Modules,
      TechnicalCommitteeMethods,
      TimelineItemTypes,
      CollectiveMethods,
    },
    isSingleMemberCollectivePropose,
    extractCommonFieldsFromSinglePropose,
  },
} = require("@subsquare/scan-common");

function isTechCommProposeCall(call) {
  return (
    Modules.TechnicalCommittee === call.section &&
    TechnicalCommitteeMethods.propose === call.method
  );
}

async function handleTechCommPropose(
  call,
  signer,
  extrinsicIndexer,
  extrinsicEvents
) {
  if (!isTechCommProposeCall(call)) {
    return;
  }

  if (!isSingleMemberCollectivePropose(call, extrinsicEvents)) {
    return;
  }

  const fields = extractCommonFieldsFromSinglePropose(
    call,
    signer,
    extrinsicIndexer,
    extrinsicEvents,
    Modules.TechnicalCommittee
  );

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: CollectiveMethods.propose,
    args: {
      proposer: fields.propose,
      hash: fields.hash,
      threshold: fields.threshold,
    },
    indexer: extrinsicIndexer,
  };

  const { publicProposals } = await extractPublicProposals(
    call.args[1],
    signer,
    extrinsicIndexer,
    extrinsicEvents
  );
  const obj = {
    ...fields,
    publicProposals,
    timeline: [timelineItem],
  };

  for (const { proposalIndex } of publicProposals) {
    await updateDemocracyPublicProposal(proposalIndex, null, null, {
      hash: fields.hash,
      indexer: extrinsicIndexer,
    });
  }
  await insertTechCommMotion(obj);
  await insertTechCommMotionPost(extrinsicIndexer, fields.hash, null, signer);
}

module.exports = {
  handleTechCommPropose,
};
