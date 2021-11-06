const { extractHeights } = require("./common");
const { getTreasuryProposalCollection } = require("../mongo/data");

async function getTreasuryProposalHeights() {
  const col = await getTreasuryProposalCollection();
  const proposals = await col.find({}).toArray();

  return extractHeights(proposals);
}

module.exports = {
  getTreasuryProposalHeights,
};
