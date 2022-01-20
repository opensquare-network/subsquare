const { getDemocracyPreImageCollection } = require("../mongo/data");

async function getPreImageHeights() {
  const col = await getDemocracyPreImageCollection();
  const records = await col.find({}).toArray();

  const heights = [];
  for (const record of records) {
    heights.push(record.indexer.blockHeight);
  }

  return [...new Set(heights)];
}

module.exports = {
  getPreImageHeights,
};
