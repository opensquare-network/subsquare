const data = {
  scanHeight: 0,
};

function setScanHeight(height) {
  data.scanHeight = height;
}

function getScanHeight() {
  return data.scanHeight;
}

module.exports = {
  setScanHeight,
  getScanHeight,
};
