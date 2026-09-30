import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

dayjs.extend(utc);

// Parameters from Asset Hub Polkadot's EraPayout (MARCH_2026_TI,
// HARD_CAP_TARGET, HARD_CAP_START, BI_ANNUAL_RATE and MILLISECONDS_PER_YEAR):
// https://github.com/polkadot-fellows/runtimes/blob/ef651a6fe6dd50d98b41dbd8194f135e7cbfbe03/system-parachains/asset-hubs/asset-hub-polkadot/src/staking/mod.rs#L314-L341
export const initialSupply = new BigNumber("16743421533310057487");
const supplyCap = new BigNumber("21000000000000000000");
const startBlock = 30_349_908;
export const startTimestamp = dayjs.utc("2026-03-14").valueOf();
const blockTime = 6_000;
const yearDuration = 365.25 * 24 * 60 * 60 * 1_000;
const periodBlocks = (2 * yearDuration) / blockTime;
const reduction = new BigNumber("0.2628");
const remaining = new BigNumber(1).minus(reduction);

// Adapted from EraPayout::yearly_after_hard_cap and SteppedCurve::last_step_size:
// https://github.com/polkadot-fellows/runtimes/blob/ef651a6fe6dd50d98b41dbd8194f135e7cbfbe03/system-parachains/asset-hubs/asset-hub-polkadot/src/staking/mod.rs#L343-L375
// https://github.com/polkadot-fellows/runtimes/blob/ef651a6fe6dd50d98b41dbd8194f135e7cbfbe03/system-parachains/asset-hubs/asset-hub-polkadot/src/staking/stepped_curve.rs#L86-L124
// Each two-year step emits 26.28% of the remaining gap to the cap;
// divide that step's emission by two to obtain the annual scheduled amount.
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
    .shiftedBy(-SYMBOL_DECIMALS.DOT)
    .toFixed(10, BigNumber.ROUND_DOWN);
}

function calcHistoricalIssuancePoints(timestamp, relayBlockNumber) {
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
  points.sort((a, b) => a.timestamp - b.timestamp);
  return points;
}

// Estimate future dates with 6-second relay blocks, then accumulate issuance
// at month starts and two-year rate changes. These are projected supply values.
function calcFutureSupplyProjection(
  { supplyDot, timestamp, relayBlockNumber, annualIssuance },
  endTimestamp,
) {
  const period = Math.floor((relayBlockNumber - startBlock) / periodBlocks);
  const nextBlock = startBlock + (period + 1) * periodBlocks;
  const nextTimestamp = timestamp + (nextBlock - relayBlockNumber) * blockTime;
  const nextPeriod = {
    start: nextTimestamp,
    end: nextTimestamp + 2 * yearDuration,
    annualIssuance: calcAnnualIssuance(nextBlock),
    changePercent: reduction.times(-100).toNumber(),
  };
  const points = [
    { timestamp, annualIssuance, totalSupply: supplyDot.toFixed() },
  ];
  let projectedSupply = supplyDot;
  let previousTimestamp = timestamp;
  let currentAnnualIssuance = new BigNumber(annualIssuance);
  let nextPeriodTimestamp = nextTimestamp;
  let nextPeriodBlock = nextBlock;
  let nextMonthTimestamp = dayjs
    .utc(timestamp)
    .add(1, "month")
    .startOf("month")
    .valueOf();

  while (previousTimestamp < endTimestamp) {
    const pointTimestamp = Math.min(
      nextMonthTimestamp,
      nextPeriodTimestamp,
      endTimestamp,
    );
    projectedSupply = projectedSupply.plus(
      currentAnnualIssuance
        .times(pointTimestamp - previousTimestamp)
        .div(yearDuration),
    );
    if (pointTimestamp === nextPeriodTimestamp) {
      currentAnnualIssuance = new BigNumber(
        calcAnnualIssuance(nextPeriodBlock),
      );
      nextPeriodTimestamp += 2 * yearDuration;
      nextPeriodBlock += periodBlocks;
    }
    if (pointTimestamp === nextMonthTimestamp) {
      nextMonthTimestamp = dayjs
        .utc(nextMonthTimestamp)
        .add(1, "month")
        .valueOf();
    }
    points.push({
      timestamp: pointTimestamp,
      annualIssuance: currentAnnualIssuance.toFixed(),
      totalSupply: projectedSupply.toFixed(10, BigNumber.ROUND_DOWN),
    });
    previousTimestamp = pointTimestamp;
  }

  return { points, nextPeriod };
}

export function calcSupplyProjection(
  { totalSupply, timestamp, relayBlockNumber },
  endTimestamp = dayjs.utc("2050-01-01").valueOf(),
) {
  const isValidTimeRange =
    timestamp >= startTimestamp && endTimestamp > timestamp;
  if (!isValidTimeRange) {
    return null;
  }

  const annualIssuance = calcAnnualIssuance(relayBlockNumber);
  if (annualIssuance === null) {
    return null;
  }

  const supplyDot = new BigNumber(totalSupply).shiftedBy(-SYMBOL_DECIMALS.DOT);
  const historicalPoints = calcHistoricalIssuancePoints(
    timestamp,
    relayBlockNumber,
  );
  const { points: futurePoints, nextPeriod } = calcFutureSupplyProjection(
    { supplyDot, timestamp, relayBlockNumber, annualIssuance },
    endTimestamp,
  );
  return { points: [...historicalPoints, ...futurePoints], nextPeriod };
}
