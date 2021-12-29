const { getCouncilName } = require("../../common/motion/utils");
const { insertMotionPost } = require("../../../mongo/service/business/motion");
const {
  handleBusinessWhenMotionProposed,
} = require("../../event/motion/store/hooks/proposed");
const { insertMotion } = require("../../../mongo/service/onchain/motion");
const {
  log: { busLogger },
  business: {
    consts: { Modules, CollectiveMethods, KaruraModules },
    extractCouncilMotionBusiness,
    isSingleMemberCollectivePropose,
    extractCommonFieldsFromSinglePropose,
  },
} = require("@subsquare/scan-common");

function isCouncilProposeCall(call) {
  return (
    [KaruraModules.GeneralCouncil, Modules.Council].includes(call.section) &&
    CollectiveMethods.propose === call.method
  );
}

async function handleCouncilPropose(
  call,
  signer,
  extrinsicIndexer,
  extrinsicEvents
) {
  if (!isCouncilProposeCall(call)) {
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
    getCouncilName()
  );

  const proposalCall = call.args[1];
  const { treasuryProposals, treasuryBounties, externalProposals } =
    await extractCouncilMotionBusiness(
      proposalCall,
      signer,
      extrinsicIndexer,
      extrinsicEvents
    );

  const obj = {
    ...fields,
    treasuryProposals,
    treasuryBounties,
    externalProposals,
  };

  await insertMotion(obj);
  await insertMotionPost(extrinsicIndexer, motionHash, null, signer);
  await handleBusinessWhenMotionProposed(
    obj,
    proposalCall,
    extrinsicIndexer,
    extrinsicEvents
  );

  busLogger.info(`motion ${motionHash} created`, extrinsicIndexer);
}

module.exports = {
  handleCouncilPropose,
};
