import BigNumber from "bignumber.js";

const fmt = {
  decimalSeparator: ".",
  groupSeparator: ",",
  groupSize: 3,
};

export const formatBN = (balance, decimalPlaces = 0) =>
  new BigNumber(balance).dp(decimalPlaces, BigNumber.ROUND_DOWN).toFormat(fmt);
