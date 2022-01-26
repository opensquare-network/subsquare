const {
  updateDemocracyPublicProposal,
} = require("../../../mongo/service/onchain/democracyPublicProposal");
const {
  business: {
    consts: { Modules, DemocracyMethods },
    getPublicProposalDeposit,
  },
  log: { busLogger },
} = require("@subsquare/scan-common");

async function handleSecond(call, signer, extrinsicIndexer) {
  const { section, method } = call;
  if (Modules.Democracy !== section || DemocracyMethods.second !== method) {
    return;
  }

  busLogger.info(
    `second extrinsic detected at ${extrinsicIndexer.blockHeight}`
  );
  const proposalIndex = call.args[0].toNumber();
  const deposit = await getPublicProposalDeposit(
    proposalIndex,
    extrinsicIndexer
  );

  await updateDemocracyPublicProposal(proposalIndex, {
    deposit,
  });
}

module.exports = {
  handleSecond,
};
