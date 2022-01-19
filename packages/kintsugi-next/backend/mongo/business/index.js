const businessDb = require("@subsquare/backend-common/mongo/business");

module.exports = {
  ...businessDb,
  getTreasuryProposalCollection: () => businessDb.getCollection("treasuryProposal"),
  getDemocracyCollection: () => businessDb.getCollection("democracy"),
  getTechCommMotionCollection: () => businessDb.getCollection("techCommMotion"),
};
