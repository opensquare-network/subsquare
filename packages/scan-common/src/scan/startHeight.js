const { CHAINS } = require("../env");
const scanStartHeight = {
  [CHAINS.KHALA]: 320020,
  [CHAINS.KARURA]: 43249,
  [CHAINS.KINTSUGI]: 173680,
  [CHAINS.BIFROST]: 347015,
};

module.exports = {
  scanStartHeight,
};
