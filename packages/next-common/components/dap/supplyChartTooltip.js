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
) {
  const date = dayjs.utc(timestamp);
  const isHistorical =
    !Number.isFinite(currentTimestamp) || timestamp <= currentTimestamp;
  const projectionPoint = points.find((point) => point.timestamp === timestamp);
  const annualIssuance = points.findLast(
    (point) => point.timestamp <= timestamp && point.annualIssuance !== null,
  )?.annualIssuance;
  if (!isHistorical) {
    return [
      `Planned issuance: ${formatAmount(annualIssuance, "DOT / year")}`,
      `Projected supply: ${formatAmount(projectionPoint?.totalSupply)}`,
    ];
  }

  const actualSupply =
    timestamp === currentTimestamp
      ? projectionPoint?.totalSupply
      : supplyHistory.find((point) => dayjs.utc(point.x).isSame(date, "day"))
          ?.y;
  return [
    `Actual issuance: ${formatAmount(annualIssuance, "DOT / year")}`,
    `Actual supply: ${formatAmount(actualSupply)}`,
  ];
}
