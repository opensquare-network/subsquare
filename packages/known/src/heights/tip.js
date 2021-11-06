const { extractHeights } = require("./common");
const { getTipCollection } = require("../mongo/data");

async function getTipHeights() {
  const col = await getTipCollection();
  const records = await col.find({}).toArray();

  return extractHeights(records);
}

module.exports = {
  getTipHeights,
};
