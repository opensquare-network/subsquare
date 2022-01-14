const { getStatusCollection } = require("../../mongo/chain");

async function getScanHeight(ctx) {
  const chainStatusCol = await getStatusCollection();
  const scanHeight = await chainStatusCol.findOne({
    name: "main-scan-height",
  });

  ctx.body = {
    value: scanHeight?.value || 0,
  };
}

module.exports = {
  getScanHeight,
};
