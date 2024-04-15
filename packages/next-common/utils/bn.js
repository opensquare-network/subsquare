import BigNumber from "bignumber.js";

const fmt = {
  decimalSeparator: ".",
  groupSeparator: ",",
  groupSize: 3,
};

export const bnToLocaleString = (bn, decimalPlaces = 0) =>
  new BigNumber(bn).dp(decimalPlaces, BigNumber.ROUND_DOWN).toFormat(fmt);

/**
 * @param {BigNumber} numerator
 * @param {BigNumber} denominator
 */
export function bnToPercentage(numerator, denominator) {
  return denominator.isZero()
    ? 0
    : numerator.div(denominator).times(100).toNumber();
}
