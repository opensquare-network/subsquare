import { Line } from "react-chartjs-2";
import "next-common/components/charts/globalConfig";
import dayjs from "dayjs";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useCollectivesSection } from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import { useThemeSetting } from "next-common/context/theme";

const CHART_HEIGHT = 360;
const MAX_RANK = 7;

// The area fill under the line is derived from the line color via CSS
// color-mix() with transparent, so it follows the theme while staying
// semi-transparent (canvas fillStyle supports color-mix in modern browsers).
const FILL_OPACITY = 5; // percent of the line color over transparent

const EVENT_NAMES = {
  Promoted: "Promotion",
  Demoted: "Demotion",
  Proven: "Retention",
  Inducted: "Inducted",
  Offboarded: "Offboarded",
  Imported: "Imported",
};

export function buildRankChartData(points = []) {
  const events = (points || [])
    .filter((p) => p?.time && !Number.isNaN(Number(p.time)))
    .map((p) => ({
      time: Number(p.time),
      rank: p.rank,
      event: p.event,
    }))
    .sort((a, b) => a.time - b.time);

  // A member who never held a rank greater than 0 (e.g. only inducted then
  // offboarded) has no meaningful rank history to plot.
  if (!events.some((p) => p.rank > 0)) {
    return { points: [] };
  }

  const stepPoints = [];
  let prevRank = 0;
  for (const point of events) {
    stepPoints.push({
      x: point.time,
      y: point.rank,
      event: point.event,
      fromRank: prevRank,
    });
    prevRank = point.rank;
  }

  // Extend the line to the current time at the last known rank
  stepPoints.push({ x: Date.now(), y: stepPoints[stepPoints.length - 1].y });

  return { points: stepPoints };
}

function RankChartTooltip({ x, y, visible, data }) {
  const tooltipRef = useRef(null);
  const [geometry, setGeometry] = useState({ width: 0, offset: 0 });

  // The tooltip is centered on the caret, so near the chart edges it would
  // overflow the chart and get clipped, squeezing its content. Measure it and
  // shift it horizontally so it always stays fully inside the chart.
  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (!visible || !tooltip) {
      setGeometry({ width: 0, offset: 0 });
      return;
    }

    const tooltipWidth = tooltip.offsetWidth;
    const containerWidth = tooltip.parentElement?.offsetWidth || 0;
    if (!tooltipWidth || !containerWidth) {
      setGeometry({ width: 0, offset: 0 });
      return;
    }

    const halfWidth = tooltipWidth / 2;
    // Clamp the tooltip center so neither edge sticks out of the chart.
    const clampedLeft = Math.min(
      Math.max(halfWidth, x),
      Math.max(halfWidth, containerWidth - halfWidth),
    );
    setGeometry({ width: tooltipWidth, offset: clampedLeft - x });
  }, [visible, x, data]);

  if (!visible || !data) {
    return null;
  }

  const { event } = data;
  const time = data.x;
  const rank = data.y;
  const fromRank = data.fromRank;
  const isRankChange =
    (event === "Promoted" ||
      event === "Demoted" ||
      event === "Imported" ||
      event === "Offboarded") &&
    fromRank !== rank;

  return (
    <div
      ref={tooltipRef}
      className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-full"
      style={{ left: x + geometry.offset, top: y - 12 }}
    >
      <div className="rounded py-1.5 px-3 text12Normal text-white bg-tooltipBg whitespace-nowrap">
        <div>{dayjs(time).format("YYYY-MM-DD")}</div>
        <div>Rank: {isRankChange ? `${fromRank} → ${rank}` : rank}</div>
        {EVENT_NAMES[event] && <div>Event: {EVENT_NAMES[event]}</div>}
        <div
          className="absolute w-0 h-0 -translate-x-1/2"
          style={{
            // Keep the arrow pointing at the caret even when the tooltip is
            // shifted to stay inside the chart.
            left: geometry.width / 2 - geometry.offset,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid var(--tooltipBg)",
            bottom: -6,
          }}
        />
      </div>
    </div>
  );
}

export default function ProfileFellowshipCoreRank() {
  const { fellowshipUserRankHistory, ambassadorUserRankHistory } =
    usePageProps();
  const section = useCollectivesSection();

  const rankHistory =
    section === "fellowship"
      ? fellowshipUserRankHistory
      : section === "ambassador"
      ? ambassadorUserRankHistory
      : null;

  const theme = useThemeSetting();

  const { points } = useMemo(
    () => buildRankChartData(rankHistory || []),
    [rankHistory],
  );

  const [tooltip, setTooltip] = useState(null);

  const externalTooltip = useCallback(({ tooltip: tooltipModel }) => {
    if (!tooltipModel || tooltipModel.opacity === 0) {
      setTooltip((prev) => (prev ? null : prev));
      return;
    }

    const dataPoint = tooltipModel.dataPoints?.[0];
    const point = dataPoint?.raw;
    if (!point) {
      setTooltip((prev) => (prev ? null : prev));
      return;
    }

    setTooltip((prev) => {
      const next = {
        x: tooltipModel.caretX,
        y: tooltipModel.caretY,
        data: point,
      };
      if (
        prev &&
        prev.x === next.x &&
        prev.y === next.y &&
        prev.data === next.data
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  const chartData = useMemo(
    () => ({
      datasets: [
        {
          label: "Rank",
          data: points,
          borderColor: theme.theme500,
          backgroundColor: `color-mix(in srgb, ${theme.theme500} ${FILL_OPACITY}%, transparent)`,
          borderWidth: 2,
          pointRadius: (ctx) => (ctx.dataIndex === points.length - 1 ? 0 : 3),
          pointBackgroundColor: theme.theme500,
          pointBorderColor: theme.theme500,
          pointBorderWidth: 0,
          pointHoverRadius: 5,
          pointHitRadius: 10,
          fill: true,
          stepped: true,
          // Allow the rank-0 point (bottom edge of the plot area) and the
          // rank-7 point (top edge) to overflow a little, so they render full
          // circles instead of being clipped in half. The space outside the
          // plot area is ample for the point radius (3) and hover radius (5);
          // the left/right sides clip exactly at the area.
          clip: { top: 6, right: 0, bottom: 6, left: 0 },
        },
      ],
    }),
    [points, theme.theme500],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external: externalTooltip,
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: "month",
            displayFormats: {
              month: "YYYY-MM",
            },
          },
          grid: {
            display: false,
          },
          ticks: {
            color: theme.textTertiary,
            maxRotation: 0,
            maxTicksLimit: 8,
          },
        },
        y: {
          beginAtZero: true,
          min: 0,
          max: MAX_RANK,
          border: {
            display: false,
          },
          grid: {
            color: theme.neutral300,
            drawTicks: false,
          },
          ticks: {
            precision: 0,
            stepSize: 1,
            color: theme.textTertiary,
          },
        },
      },
    }),
    [externalTooltip, theme.textTertiary, theme.neutral300],
  );

  if (!points.length) {
    return (
      <div
        className="flex items-center justify-center text-textTertiary"
        style={{ height: CHART_HEIGHT }}
      >
        No rank data
      </div>
    );
  }

  return (
    <div className="w-full relative" style={{ height: CHART_HEIGHT }}>
      <Line data={chartData} options={options} />
      <RankChartTooltip
        x={tooltip?.x}
        y={tooltip?.y}
        visible={!!tooltip}
        data={tooltip?.data}
      />
    </div>
  );
}
