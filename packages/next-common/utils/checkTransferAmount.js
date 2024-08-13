import BigNumber from "bignumber.js";

export function checkTransferAmount({
  transferAmount,
  decimals,
  transferrable,
}) {
  if (!transferAmount) {
    throw new Error("Please fill the amount");
  }

  const amount = new BigNumber(transferAmount).times(Math.pow(10, decimals));
  if (amount.isNaN() || amount.lte(0) || !amount.isInteger()) {
    throw new Error("Invalid amount");
  }
  if (transferrable && amount.gt(transferrable)) {
    throw new Error("Insufficient balance");
  }

  return amount.toFixed();
}
