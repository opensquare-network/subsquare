import BigNumber from "bignumber.js";

/**
 * Generate reciprocal curve function.
 * @param factor
 * @param xOffset
 * @param yOffset
 * @returns {function(*=): string} approval percentage
 */
export function makeReciprocalCurve(factor, xOffset, yOffset) {
  return function (percentage) {
    const x = percentage * Math.pow(10, 9);

    const v = new BigNumber(factor)
      .div(new BigNumber(x).plus(xOffset))
      .multipliedBy(Math.pow(10, 9))
      .toFixed(0, BigNumber.ROUND_DOWN);

    return new BigNumber(v).plus(yOffset).div(Math.pow(10, 9)).toString();
  };
}

/**
 * Generate linear curve function.
 * @param length
 * @param floor
 * @param ceil
 * @returns {function(*=): string}
 */
export function makeLinearCurve(length, floor, ceil) {
  return function (percentage) {
    const x = percentage * Math.pow(10, 9);

    const xValue = BigNumber.min(x, length);
    const slope = new BigNumber(ceil).minus(floor).dividedBy(length);
    const deducted = slope.multipliedBy(xValue).toString();

    const perbill = new BigNumber(ceil)
      .minus(deducted)
      .toFixed(0, BigNumber.ROUND_DOWN);
    return new BigNumber(perbill).div(Math.pow(10, 9)).toString();
  };
}
