const businessDb = require("@subsquare/backend-common/mongo/business");

module.exports = {
  ...businessDb,
  getTipCollection: () => businessDb.getCollection("tip"),
  getTreasuryProposalCollection: () => businessDb.getCollection("treasuryProposal"),
  getBountyCollection: () => businessDb.getCollection("bounty"),
  getDemocracyCollection: () => businessDb.getCollection("democracy"),
  getMotionCollection: () => businessDb.getCollection("motion"),
  getTechCommMotionCollection: () => businessDb.getCollection("techCommMotion"),
  getFinancialMotionCollection: () => businessDb.getCollection("financialMotion"),
};
