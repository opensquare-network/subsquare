const { SupportChains } = require("../constants");

const data = SupportChains.reduce((result, chain) => {
  result[chain] = {
    scanHeight: 0,
  };
  return result;
}, {});

function setScanHeight(chain, height) {
  data[chain].scanHeight = height;
}

function getScanHeight(chain) {
  return data[chain].scanHeight;
}

module.exports = {
  setScanHeight,
  getScanHeight,
};
