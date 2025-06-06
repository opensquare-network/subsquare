import BigNumber from "bignumber.js";

const BNCS = 1_000_000_000_000;
const CENTS = BNCS / 100; // assume this is worth about a cent.

function deposit(items, bytes) {
  const v1 = new BigNumber(items).times(15).times(CENTS);
  const v2 = new BigNumber(bytes).times(6).times(CENTS);
  return v1.plus(v2).toString();
}

const preimageBaseDeposit = deposit(2, 64);
const preimageByteDeposit = deposit(0, 1);

const bifrostPreimageSettings = {
  baseDeposit: preimageBaseDeposit,
  byteDeposit: preimageByteDeposit,
};

export default bifrostPreimageSettings;
