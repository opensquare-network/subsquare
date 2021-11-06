const { extractHeights } = require("./common");
const { getBountyCollection } = require("../mongo/data");

async function getBountyHeights() {
  const col = await getBountyCollection();
  const records = await col.find({}).toArray();

  return extractHeights(records);
}

module.exports = {
  getBountyHeights,
};
