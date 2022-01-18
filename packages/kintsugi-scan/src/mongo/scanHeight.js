const { getStatusCollection } = require("./index");
const {
  scan: { scanStartHeight },
  env: { currentChain },
} = require("@subsquare/scan-common");

const genesisHeight = 1;
const mainScanName = "main-scan-height";

async function getNextScanHeight() {
  const statusCol = await getStatusCollection();
  const heightInfo = await statusCol.findOne({ name: mainScanName });

  let result = genesisHeight;
  if (!heightInfo) {
    result = genesisHeight;
  } else if (typeof heightInfo.value === "number") {
    result = heightInfo.value + 1;
  } else {
    console.error("Scan height value error in DB!");
    process.exit(1);
  }

  return Math.max(scanStartHeight[currentChain()], result);
}

async function updateScanHeight(height) {
  const statusCol = await getStatusCollection();
  await statusCol.findOneAndUpdate(
    { name: mainScanName },
    { $set: { value: height } },
    { upsert: true }
  );
}

module.exports = {
  getNextScanHeight,
  updateScanHeight,
};
