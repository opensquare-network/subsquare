const { extractHeights } = require("./common");
const { getTechCommMotionCollection } = require("../mongo/data");

async function getTechCommHeights() {
  const col = await getTechCommMotionCollection();
  const motions = await col.find({}).toArray();

  return extractHeights(motions);
}

module.exports = {
  getTechCommHeights,
};
