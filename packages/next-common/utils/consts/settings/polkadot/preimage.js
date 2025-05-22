const BigNumber = require("bignumber.js");

const DOLLARS = 10_000_000_000;
const CENTS = DOLLARS / 100; // 100_000_000
const MILLICENTS = CENTS / 1_000; // 100_000

function deposit(items, bytes) {
  const v1 = new BigNumber(items).times(20).times(DOLLARS);
  const v2 = new BigNumber(bytes).times(100).times(MILLICENTS);
  return v1.plus(v2).toString();
}

const preimageBaseDeposit = deposit(2, 64);
const preimageByteDeposit = deposit(0, 1);

module.exports = {
  baseDeposit: preimageBaseDeposit,
  byteDeposit: preimageByteDeposit,
};
