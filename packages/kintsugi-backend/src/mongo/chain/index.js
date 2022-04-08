const chainDb = require("@subsquare/backend-common/mongo/chain");

module.exports = {
  ...chainDb,
  getTreasuryProposalCollection: () => chainDb.getCollection("treasuryProposal"),
  getTechCommMotionCollection: () => chainDb.getCollection("techCommMotion"),
  getPublicProposalCollection: () => chainDb.getCollection("democracyPublicProposal"),
  getReferendumCollection: () => chainDb.getCollection("democracyReferendum"),
  getPreImageCollection: () => chainDb.getCollection("democracyPreImage"),
};
