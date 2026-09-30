import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useThemeSetting } from "next-common/context/theme";
import { abbreviateBigNumber } from "next-common/utils/viewfuncs";
import getSupplyTooltipLines from "./supplyChartTooltip";

dayjs.extend(utc);

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

export default function useSupplyChart(
  points = [],
  currentTimestamp,
  supplyHistory = [],
) {
  const {
    purple500,
    green500,
    tooltipBg,
    textTertiary,
    neutral100,
    neutral300,
    neutral400,
  } = useThemeSetting();
  const issuance = points.map(({ timestamp, annualIssuance }) => ({
    x: timestamp,
    y: annualIssuance === null ? null : Number(annualIssuance),
  }));
  const historicalIssuance = issuance.filter(({ x }) => x <= currentTimestamp);
  const scheduledIssuance = issuance.filter(({ x }) => x >= currentTimestamp);
  const timestamps = [
    points[0]?.timestamp,
    points.at(-1)?.timestamp,
    supplyHistory[0]?.x,
    supplyHistory.at(-1)?.x,
    historicalIssuance[0]?.x,
    historicalIssuance.at(-1)?.x,
  ].filter(Number.isFinite);
  const startTimestamp = timestamps.length
    ? Math.min(...timestamps)
    : undefined;
  const endTimestamp = timestamps.length ? Math.max(...timestamps) : undefined;
  const data = {
    datasets: [
      {
        label: "Actual issuance",
        data: historicalIssuance,
        pointRadius: historicalIssuance.length === 1 ? 3 : 0,
        stepped: "before",
        yAxisID: "y",
        borderColor: purple500,
        backgroundColor: purple500,
      },
      {
        label: "Actual supply",
        data: supplyHistory,
        pointRadius: supplyHistory.length === 1 ? 3 : 0,
        yAxisID: "supply",
        borderColor: green500,
        backgroundColor: green500,
      },
      {
        label: "Planned issuance",
        data: scheduledIssuance,
        yAxisID: "y",
        borderColor: purple500,
        backgroundColor: purple500,
        stepped: "before",
        borderDash: [6, 4],
      },
      {
        label: "Projected supply",
        data: points.map(({ totalSupply, timestamp }) => ({
          x: timestamp,
          y:
            totalSupply !== null && timestamp >= currentTimestamp
              ? Number(totalSupply)
              : null,
        })),
        yAxisID: "supply",
        borderColor: green500,
        backgroundColor: green500,
        borderDash: [6, 4],
      },
    ].filter(({ data }) => data.some(({ y }) => Number.isFinite(y))),
  };
  const options = {
    clip: false,
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: "nearest", axis: "x", intersect: false },
    elements: {
      line: { borderWidth: 2, tension: 0 },
      point: {
        radius: 0,
        hoverRadius: 4,
        hitRadius: 8,
      },
    },
    scales: {
      x: {
        border: { display: false },
        grid: { display: false },
        type: "time",
        min: startTimestamp,
        max: endTimestamp,
        time: { unit: "year" },
        afterBuildTicks: (scale) => {
          const years = scale.ticks.filter(
            ({ value }) =>
              value > startTimestamp &&
              dayjs.utc(value).month() === 0 &&
              dayjs.utc(value).date() === 1,
          );
          const interval = Math.max(1, Math.ceil(years.length / 5));
          scale.ticks = [startTimestamp]
            .filter(Number.isFinite)
            .map((value) => ({ value }));
          scale.ticks.push(
            ...years.filter(
              (_, index) => (years.length - 1 - index) % interval === 0,
            ),
          );
          scale.ticks.sort((a, b) => a.value - b.value);
        },
        ticks: {
          color: textTertiary,
          source: "data",
          autoSkip: false,
          maxRotation: 0,
          callback: (value) => dayjs.utc(value).year(),
        },
      },
      y: {
        border: { display: false },
        position: "left",
        beginAtZero: true,
        ticks: {
          color: textTertiary,
          maxTicksLimit: 5,
          callback: (value) => abbreviateBigNumber(value, 0),
        },
        grid: { display: true, color: neutral300, drawTicks: false },
      },
      supply: {
        position: "right",
        ticks: {
          color: textTertiary,
          maxTicksLimit: 5,
          callback: (value) => abbreviateBigNumber(value, 2),
        },
        grid: { drawOnChartArea: false, drawTicks: false },
        border: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      hoverLine: { lineColor: neutral400, lineWidth: 1 },
      annotation: {
        annotations: {
          now: {
            display: Number.isFinite(currentTimestamp),
            type: "line",
            xMin: currentTimestamp,
            xMax: currentTimestamp,
            borderColor: neutral300,
            borderWidth: 1,
            borderDash: [3, 3],
          },
        },
      },
      tooltip: {
        position: "nearest",
        yAlign: "center",
        displayColors: false,
        mode: "nearest",
        axis: "x",
        intersect: false,
        backgroundColor: tooltipBg,
        titleColor: neutral100,
        bodyColor: neutral100,
        callbacks: {
          title: ([{ parsed }]) => dayjs.utc(parsed.x).format("MMM YYYY"),
          label: () => null,
          afterBody: ([{ parsed }]) =>
            getSupplyTooltipLines(
              parsed.x,
              currentTimestamp,
              points,
              supplyHistory,
            ),
        },
      },
    },
  };

  return { data, options };
}
