import BigNumber from "bignumber.js";
import { toPercentage } from ".";

export const Conviction = {
  None: 0,
  Locked1x: 1,
  Locked2x: 2,
  Locked3x: 3,
  Locked4x: 4,
  Locked5x: 5,
  Locked6x: 6,
};

export const ConvictionSupport = {
  None: 0.1,
  Locked1x: 1,
  Locked2x: 2,
  Locked3x: 3,
  Locked4x: 4,
  Locked5x: 5,
  Locked6x: 6,
};

const AYE_BITS = 0b10000000;
const CON_MASK = 0b01111111;

export const isAye = (vote) => (vote & AYE_BITS) === AYE_BITS;
export const getConviction = (vote) => vote & CON_MASK;

export const convictionToLockX = (conviction) => {
  switch (conviction) {
    case 0:
      return "0.1x";
    case 1:
      return "1x";
    case 2:
      return "2x";
    case 3:
      return "3x";
    case 4:
      return "4x";
    case 5:
      return "5x";
    case 6:
      return "6x";
    default:
      return "0.1x";
  }
};

export function getTallyVotesBarPercent(tally) {
  const ayes = tally?.ayes ?? 0;
  const nays = tally?.nays ?? 0;

  let ayesPercent = 50;
  let naysPercent = 50;
  const nTotal = new BigNumber(ayes).plus(nays);
  if (nTotal.gt(0)) {
    ayesPercent = new BigNumber(ayes).div(nTotal).toNumber();
    naysPercent = 1 - ayesPercent;
    ayesPercent = toPercentage(ayesPercent, 1);
    naysPercent = toPercentage(naysPercent, 1);
  }

  return {
    ayesPercent,
    naysPercent,
  };
}
