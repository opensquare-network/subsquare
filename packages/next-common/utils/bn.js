import BigNumber from "bignumber.js";

const fmt = {
  decimalSeparator: ".",
  groupSeparator: ",",
  groupSize: 3,
};

export const bnToLocaleString = (bn, decimalPlaces = 0) =>
  new BigNumber(bn).dp(decimalPlaces, BigNumber.ROUND_DOWN).toFormat(fmt);
