const { createKeyMulti, encodeAddress } = require("@polkadot/util-crypto");

function calcMultisigAddress(signatories, threshold, chainSS58) {
  const multiPub = createKeyMulti(signatories, threshold);
  return encodeAddress(multiPub, chainSS58);
}

module.exports = {
  calcMultisigAddress,
};
