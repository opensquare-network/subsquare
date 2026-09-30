import { abbreviateBigNumber } from "next-common/utils/viewfuncs";

export const supplyTooltipPlugin = {
  id: "dapSupplyTooltip",
  beforeTooltipDraw(chart, { tooltip }) {
    const { top, bottom } = chart.chartArea;
    tooltip.caretY = (top + bottom) / 2;
    tooltip.y = Math.max(
      0,
      Math.min(
        tooltip.caretY - tooltip.height / 2,
        chart.height - tooltip.height,
      ),
    );
  },
};

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
      : supplyHistory.find((point) => point.x === timestamp)?.y;
  return [
    `Actual issuance: ${formatAmount(annualIssuance, "DOT / year")}`,
    `Actual supply: ${formatAmount(actualSupply)}`,
  ];
}
