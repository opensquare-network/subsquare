import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import { initialSupply, startTimestamp } from "./supplyProjection";

dayjs.extend(utc);

export function calcSupplyHistory(records, isMinted) {
  if (!Array.isArray(records)) {
    throw new Error("Invalid supply history response");
  }

  let history = records.map((record) => {
    const { timestamp, totalSupply, totalMinted } = record ?? {};
    const amount = new BigNumber(isMinted ? totalMinted : totalSupply);
    if (
      !Number.isSafeInteger(timestamp) ||
      timestamp <= 0 ||
      !amount.isFinite() ||
      amount.isNegative()
    ) {
      throw new Error("Invalid supply history record");
    }

    return { x: timestamp, amount };
  });
  if (isMinted) {
    const annualTotals = new Map();
    for (const { x, amount } of history) {
      const year = dayjs.utc(x).startOf("year").valueOf();
      annualTotals.set(year, amount.plus(annualTotals.get(year) ?? 0));
    }
    history = [...annualTotals].map(([x, amount]) => ({ x, amount }));
  } else if (history.length) {
    history = history.filter(({ x }) => x >= startTimestamp);
    if (!history.some(({ x }) => x === startTimestamp)) {
      history.push({ x: startTimestamp, amount: initialSupply });
    }
  }

  return history
    .map(({ x, amount }) => ({
      x,
      y: amount.shiftedBy(-SYMBOL_DECIMALS.DOT).toNumber(),
    }))
    .sort((a, b) => a.x - b.x);
}
