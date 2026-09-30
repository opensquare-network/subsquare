import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const dotUnit = new BigNumber(10).pow(10);

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
  }

  return history
    .map(({ x, amount }) => ({ x, y: amount.div(dotUnit).toNumber() }))
    .sort((a, b) => a.x - b.x);
}
