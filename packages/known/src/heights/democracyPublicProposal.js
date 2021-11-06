const { extractHeights } = require("./common");
const { getDemocracyPublicProposalCollection } = require("../mongo/data");

async function getDemocracyPublicProposalHeights() {
  const col = await getDemocracyPublicProposalCollection();
  const records = await col.find({}).toArray();

  return extractHeights(records);
}

module.exports = {
  getDemocracyPublicProposalHeights,
};
