import BigNumber from "bignumber.js";

const multiplier = Math.pow(10, 9);

export function makeRevertReciprocalFunc(factor, xOffset, yOffset) {
  return function (y) {
    const perbillY = new BigNumber(y).multipliedBy(multiplier);
    const denominator = perbillY.minus(yOffset);
    const v = new BigNumber(factor).multipliedBy(multiplier).div(denominator);
    return v.minus(xOffset).div(multiplier).toString();
  };
}

export function makeRevertLinearFunc(length, floor, ceil) {
  return function (y) {
    const perbillY = new BigNumber(y).multipliedBy(multiplier);

    const slope = new BigNumber(ceil).minus(floor).dividedBy(length);
    const deducted = new BigNumber(ceil).minus(perbillY);
    return deducted.div(slope).div(multiplier).toString();
  };
}
