const { extractHeights } = require("./common");
const { getDemocracyPreImageCollection } = require("../mongo/data");

async function getPreImageHeights() {
  const col = await getDemocracyPreImageCollection();
  const records = await col.find({}).toArray();

  return extractHeights(records);
}

module.exports = {
  getPreImageHeights,
};
