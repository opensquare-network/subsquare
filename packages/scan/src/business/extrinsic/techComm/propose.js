const {
  insertTechCommMotionPost,
} = require("../../../mongo/service/business/techCommMotion");
const {
  extractTechCommMotionBusiness,
} = require("../../common/techComm/extractBusiness");
const {
  insertTechCommMotion,
} = require("../../../mongo/service/onchain/techCommMotion");
const {
  handleBusinessWhenTechCommMotionProposed,
} = require("../../event/techCommMotion/service/hooks/proposed");
const {
  business: {
    consts: { Modules, TechnicalCommitteeMethods },
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

  const { externalProposals } = await extractTechCommMotionBusiness(
    call.args[1],
    signer,
    extrinsicIndexer,
    extrinsicEvents
  );

  const obj = {
    ...fields,
    externalProposals,
  };

  await handleBusinessWhenTechCommMotionProposed(obj, extrinsicIndexer);
  await insertTechCommMotion(obj);
  await insertTechCommMotionPost(extrinsicIndexer, fields.hash, null, signer);
}

module.exports = {
  handleTechCommPropose,
};
