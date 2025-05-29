import BigNumber from "bignumber.js";

function formatNum(v) {
  return Math.floor(v);
}

const UNITS = 1_000_000_000_000;
const QUID = formatNum(UNITS / 30);
const CENTS = formatNum(QUID / 100);
const MILLICENTS = formatNum(CENTS / 1_000);

function deposit(items, bytes) {
  const v1 = new BigNumber(items).times(2000).times(CENTS);
  const v2 = new BigNumber(bytes).times(100).times(MILLICENTS);
  return v1.plus(v2).toString();
}

const preimageBaseDeposit = deposit(2, 64);
const preimageByteDeposit = deposit(0, 1);

const kusamaPreimageSettings = {
  baseDeposit: preimageBaseDeposit,
  byteDeposit: preimageByteDeposit,
};

export default kusamaPreimageSettings;
