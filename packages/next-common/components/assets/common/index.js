import BigNumber from "bignumber.js";

export function formatBalance(balance, decimals) {
  return new BigNumber(balance)
    .div(Math.pow(10, decimals))
    .decimalPlaces(4, BigNumber.ROUND_FLOOR)
    .toFormat({ decimalSeparator: ".", groupSeparator: ",", groupSize: 3 });
}
