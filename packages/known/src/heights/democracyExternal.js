const { extractHeights } = require("./common");
const { getDemocracyExternalCollection } = require("../mongo/data");

async function getExternalHeights() {
  const col = await getDemocracyExternalCollection();
  const records = await col.find({}).toArray();

  return extractHeights(records);
}

module.exports = {
  getExternalHeights,
};
