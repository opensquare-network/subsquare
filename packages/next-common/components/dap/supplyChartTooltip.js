import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { abbreviateBigNumber } from "next-common/utils/viewfuncs";

dayjs.extend(utc);

function formatAmount(value, unit = "DOT") {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return "--";
  }
  return `${abbreviateBigNumber(value, 2)} ${unit}`;
}

export default function getSupplyTooltipLines(
  timestamp,
  currentTimestamp,
  points,
  supplyHistory,
  issuanceHistory,
) {
  const date = dayjs.utc(timestamp);
  const isHistorical =
    !Number.isFinite(currentTimestamp) || timestamp <= currentTimestamp;
  const projectionPoint = points.find((point) => point.timestamp === timestamp);
  if (!isHistorical) {
    const plannedIssuance = points.findLast(
      (point) => point.timestamp <= timestamp && point.annualIssuance !== null,
    )?.annualIssuance;
    return [
      `Planned issuance: ${formatAmount(plannedIssuance, "DOT / year")}`,
      `Projected supply: ${formatAmount(projectionPoint?.totalSupply)}`,
    ];
  }

  const actualSupply =
    timestamp === currentTimestamp
      ? projectionPoint?.totalSupply
      : supplyHistory.find((point) => point.x === timestamp)?.y;
  const actualIssuance = issuanceHistory.find((point) =>
    dayjs.utc(point.x).isSame(date, "year"),
  )?.y;
  const issuancePeriod = dayjs.utc(currentTimestamp ?? NaN).isSame(date, "year")
    ? `${date.year()} YTD`
    : date.year();

  return [
    `Actual issuance (${issuancePeriod}): ${formatAmount(actualIssuance)}`,
    `Actual supply: ${formatAmount(actualSupply)}`,
  ];
}
