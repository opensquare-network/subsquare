import BigNumber from "bignumber.js";
import { filter, map } from "lodash-es";

const fmt = {
  decimalSeparator: ".",
  groupSeparator: ",",
  groupSize: 3,
};

export const bnToLocaleString = (bn, decimalPlaces = 0) =>
  new BigNumber(bn).dp(decimalPlaces, BigNumber.ROUND_DOWN).toFormat(fmt);

/**
 * @param {BigNumber | string | number} numerator
 * @param {BigNumber | string | number} denominator
 */
export function bnToPercentage(numerator, denominator) {
  numerator = BigNumber(numerator);
  denominator = BigNumber(denominator);

  return denominator.isZero()
    ? 0
    : numerator.div(denominator).times(100).toNumber();
}

export function bnSumBy(items = [], key) {
  const validVotes = filter(items, key);

  let res = BigNumber(0);
  const sum = BigNumber.sum(...map(validVotes, key));

  if (!sum.isNaN()) {
    res = BigNumber(sum);
  }

  return res;
}
