const chainDb = require("@subsquare/backend-common/mongo/chain");

module.exports = {
  ...chainDb,
  getTipCollection: () => chainDb.getCollection("tip"),
  getTreasuryProposalCollection: () => chainDb.getCollection("treasuryProposal"),
  getBountyCollection: () => chainDb.getCollection("bounty"),
  getMotionCollection: () => chainDb.getCollection("motion"),
  getTechCommMotionCollection: () => chainDb.getCollection("techCommMotion"),
  getFinancialMotionCollection: () => chainDb.getCollection("financialMotion"),
  getPublicProposalCollection: () => chainDb.getCollection("democracyPublicProposal"),
  getReferendumCollection: () => chainDb.getCollection("democracyReferendum"),
  getExternalCollection: () => chainDb.getCollection("democracyExternal"),
  getPreImageCollection: () => chainDb.getCollection("democracyPreImage"),
};
