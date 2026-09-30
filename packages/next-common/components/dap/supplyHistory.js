import BigNumber from "bignumber.js";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import { initialSupply, startTimestamp } from "./supplyProjection";

export function calcSupplyHistory(records) {
  if (!Array.isArray(records)) {
    throw new Error("Invalid supply history response");
  }

  const history = records
    .map((record) => {
      const { timestamp, totalSupply } = record ?? {};
      const amount = new BigNumber(totalSupply);
      if (
        !Number.isSafeInteger(timestamp) ||
        timestamp <= 0 ||
        !amount.isFinite() ||
        amount.isNegative()
      ) {
        throw new Error("Invalid supply history record");
      }

      return { x: timestamp, amount };
    })
    .filter(({ x }) => x >= startTimestamp);
  if (records.length && !history.some(({ x }) => x === startTimestamp)) {
    history.push({ x: startTimestamp, amount: initialSupply });
  }

  return history
    .map(({ x, amount }) => ({
      x,
      y: amount.shiftedBy(-SYMBOL_DECIMALS.DOT).toNumber(),
    }))
    .sort((a, b) => a.x - b.x);
}
