const { CHAINS } = require("../env");
const scanStartHeight = {
  [CHAINS.KHALA]: 310000,
  [CHAINS.KARURA]: 43249,
  [CHAINS.KINTSUGI]: 173680,
  [CHAINS.BIFROST]: 347015,
  [CHAINS.POLKADEX]: 1209570,
};

module.exports = {
  scanStartHeight,
};
