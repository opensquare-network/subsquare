const {
  insertTreasuryProposalPost,
} = require("../../../mongo/service/business/treasuryProposal");
const {
  insertTreasuryProposal,
} = require("../../../mongo/service/onchain/treasuryProposal");
const {
  log: { logger },
  business: { getTreasuryProposalFieldsWhenProposed },
} = require("@subsquare/scan-common");

async function handleProposed(event, indexer, events, extrinsic) {
  const commonObj = await getTreasuryProposalFieldsWhenProposed(...arguments);
  const obj = {
    ...commonObj,
    publicProposals: [],
  };

  await insertTreasuryProposal(obj);
  await insertTreasuryProposalPost(obj);
  logger.info(`Treasury proposal ${commonObj.proposalIndex} saved`);
}

module.exports = {
  handleProposed,
};
