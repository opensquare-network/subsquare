import BigNumber from "bignumber.js";

export default function calcPerbill(numerator = 0, denominator = 0) {
  if (!denominator) {
    return 0;
  }

  return new BigNumber(numerator)
    .div(denominator)
    .multipliedBy(Math.pow(10, 9))
    .toNumber();
}
