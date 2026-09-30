import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const initialSupply = new BigNumber("16743421533310057487");
const supplyCap = new BigNumber("21000000000000000000");
const startBlock = 30_349_908;
const startTimestamp = dayjs.utc("2026-03-14").valueOf();
const blockTime = 6_000;
const yearDuration = 365.25 * 24 * 60 * 60 * 1_000;
const periodBlocks = (2 * yearDuration) / blockTime;
const reduction = new BigNumber("0.2628");
const remaining = new BigNumber(1).minus(reduction);
const dotUnit = new BigNumber(10).pow(10);

export function calcAnnualIssuance(relayBlockNumber) {
  if (
    !Number.isSafeInteger(relayBlockNumber) ||
    relayBlockNumber < startBlock
  ) {
    return null;
  }

  const period = Math.floor((relayBlockNumber - startBlock) / periodBlocks);
  return supplyCap
    .minus(initialSupply)
    .times(reduction)
    .times(remaining.pow(period))
    .div(2)
    .div(dotUnit)
    .toFixed(10, BigNumber.ROUND_DOWN);
}

export function calcSupplyProjection(
  { totalSupply, timestamp, relayBlockNumber },
  endTimestamp = dayjs.utc("2050-01-01").valueOf(),
) {
  let supply = new BigNumber(totalSupply).div(dotUnit);
  const annualIssuance = calcAnnualIssuance(relayBlockNumber);
  if (
    !supply.isFinite() ||
    supply.isNegative() ||
    !Number.isSafeInteger(timestamp) ||
    timestamp < startTimestamp ||
    !Number.isSafeInteger(endTimestamp) ||
    endTimestamp <= timestamp ||
    annualIssuance === null
  ) {
    return null;
  }

  const period = Math.floor((relayBlockNumber - startBlock) / periodBlocks);
  const nextBlock = startBlock + (period + 1) * periodBlocks;
  const nextTimestamp = timestamp + (nextBlock - relayBlockNumber) * blockTime;
  const nextPeriod = {
    start: nextTimestamp,
    end: nextTimestamp + 2 * yearDuration,
    annualIssuance: calcAnnualIssuance(nextBlock),
    changePercent: reduction.times(-100).toNumber(),
  };
  const points = [];
  if (startTimestamp < timestamp) {
    points.push({
      timestamp: startTimestamp,
      annualIssuance: calcAnnualIssuance(startBlock),
      totalSupply: null,
    });
  }
  for (
    let historicalBlock = startBlock + periodBlocks;
    historicalBlock < relayBlockNumber;
    historicalBlock += periodBlocks
  ) {
    points.push({
      timestamp: timestamp + (historicalBlock - relayBlockNumber) * blockTime,
      annualIssuance: calcAnnualIssuance(historicalBlock),
      totalSupply: null,
    });
  }
  for (
    let month = dayjs.utc(startTimestamp).add(1, "month").startOf("month");
    month.valueOf() < timestamp;
    month = month.add(1, "month")
  ) {
    const monthlyTimestamp = month.valueOf();
    const monthlyBlock = Math.floor(
      relayBlockNumber - (timestamp - monthlyTimestamp) / blockTime,
    );
    if (points.some((point) => point.timestamp === monthlyTimestamp)) {
      continue;
    }
    points.push({
      timestamp: monthlyTimestamp,
      annualIssuance: calcAnnualIssuance(monthlyBlock),
      totalSupply: null,
    });
  }
  points.sort((a, b) => a.timestamp - b.timestamp);
  points.push({ timestamp, annualIssuance, totalSupply: supply.toFixed() });
  let previousTimestamp = timestamp;
  let currentIssuance = new BigNumber(annualIssuance);
  let boundary = nextTimestamp;
  let boundaryBlock = nextBlock;
  let nextMonth = dayjs
    .utc(timestamp)
    .add(1, "month")
    .startOf("month")
    .valueOf();

  while (previousTimestamp < endTimestamp) {
    const pointTimestamp = Math.min(nextMonth, boundary, endTimestamp);
    supply = supply.plus(
      currentIssuance
        .times(pointTimestamp - previousTimestamp)
        .div(yearDuration),
    );
    if (pointTimestamp === boundary) {
      currentIssuance = new BigNumber(calcAnnualIssuance(boundaryBlock));
      boundary += 2 * yearDuration;
      boundaryBlock += periodBlocks;
    }
    if (pointTimestamp === nextMonth) {
      nextMonth = dayjs.utc(nextMonth).add(1, "month").valueOf();
    }
    points.push({
      timestamp: pointTimestamp,
      annualIssuance: currentIssuance.toFixed(),
      totalSupply: supply.toFixed(10, BigNumber.ROUND_DOWN),
    });
    previousTimestamp = pointTimestamp;
  }

  return { points, nextPeriod };
}
