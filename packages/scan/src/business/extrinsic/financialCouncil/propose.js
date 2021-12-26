const {
  insertFinancialMotionPost,
} = require("../../../mongo/service/business/financialMotion");
const {
  insertFinancialMotion,
} = require("../../../mongo/service/onchain/financialMotion");
const {
  env: { isKarura },
  log: { busLogger },
  business: {
    consts: { CollectiveMethods, KaruraModules },
    isSingleMemberCollectivePropose,
    extractCommonFieldsFromSinglePropose,
  },
} = require("@subsquare/scan-common");

function isFinancialCouncilProposeCall(call) {
  return (
    [KaruraModules.FinancialCouncil].includes(call.section) &&
    CollectiveMethods.propose === call.method
  );
}

async function handleFinancialCouncilPropose(
  call,
  signer,
  extrinsicIndexer,
  extrinsicEvents
) {
  if (!isKarura() || !isFinancialCouncilProposeCall(call)) {
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
    KaruraModules.FinancialCouncil
  );

  await insertFinancialMotion(fields);
  await insertFinancialMotionPost(
    fields.indexer,
    fields.hash,
    null,
    fields.proposer
  );
  busLogger.info(
    `Financial motion with threshold 1 detected at ${extrinsicIndexer.blockHeight}`
  );
}

module.exports = {
  handleFinancialCouncilPropose,
};
