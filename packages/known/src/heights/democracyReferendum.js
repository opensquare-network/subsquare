const { extractHeights } = require("./common");
const { getDemocracyReferendumCollection } = require("../mongo/data");

async function getReferendumHeights() {
  const col = await getDemocracyReferendumCollection();
  const records = await col.find({}).toArray();

  return extractHeights(records);
}

module.exports = {
  getReferendumHeights,
};
