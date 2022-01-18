const { getFinancialMotionCollection } = require("../mongo/data");

async function getFinancialMotionHeights() {
  const col = await getFinancialMotionCollection();
  const motions = await col.find({}).toArray();

  const heights = [];
  for (const motion of motions) {
    (motion.timeline || []).map((item) => {
      if (item.indexer) {
        heights.push(item.indexer.blockHeight);
      }
    });
  }

  return [...new Set(heights)];
}

module.exports = {
  getFinancialMotionHeights,
};
