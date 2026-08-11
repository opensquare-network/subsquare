import { Line } from "react-chartjs-2";
import "next-common/components/charts/globalConfig";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { useAsync } from "react-use";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import { useThemeSetting } from "next-common/context/theme";
import { backendApi } from "next-common/services/nextApi";
import {
  ambassadorStatisticsMemberRankHistoryApi,
  fellowshipStatisticsMemberRankHistoryApi,
} from "next-common/services/url";
import { LoadingContent } from "next-common/components/fellowship/statistics/common";
import { FELLOWSHIP_RANK_LEVEL_NAMES } from "next-common/utils/constants";
import Link from "next-common/components/link";

const CHART_HEIGHT = 360;

// The maximum rank value on chain (fellowship / ambassador both range 0~9)
const MAX_RANK = FELLOWSHIP_RANK_LEVEL_NAMES.length - 1;

const EVENT_NAMES = {
  Promoted: "Promotion",
  Demoted: "Demotion",
  Proven: "Retention",
};

/**
 * Build rank step points from the rank change points returned by the backend.
 * Every point keeps its exact timestamp so it lands at the accurate position
 * on the time x-axis, together with the referendum that executed the change.
 * The chart starts from the first time the member holds a rank greater than 0
 * and extends to the current time at the last known rank.
 * @param {Array<{time: number, rank: number, event: string, referendumIndex: number, referendumTitle: string}>} points
 * @returns {{ points: Array<{x: number, y: number, event: string, referendumIndex: number, referendumTitle: string}> }}
 */
export function buildRankChartData(points = []) {
  const events = (points || [])
    .filter((p) => p?.time && !Number.isNaN(Number(p.time)))
    .map((p) => ({
      time: Number(p.time),
      rank: p.rank,
      event: p.event,
      referendumIndex: p.referendumIndex ?? null,
      referendumTitle: p.referendumTitle || "",
    }))
    .sort((a, b) => a.time - b.time);

  const firstPositiveIndex = events.findIndex((p) => p.rank > 0);
  if (firstPositiveIndex < 0) {
    return { points: [] };
  }

  const stepPoints = events.slice(firstPositiveIndex).map((p) => ({
    x: p.time,
    y: p.rank,
    event: p.event,
    referendumIndex: p.referendumIndex,
    referendumTitle: p.referendumTitle,
  }));

  // Extend the line to the current time at the last known rank
  stepPoints.push({ x: Date.now(), y: stepPoints[stepPoints.length - 1].y });

  return { points: stepPoints };
}

function RankChartTooltip({ x, y, visible, data, section }) {
  if (!visible || !data) {
    return null;
  }

  const { time, rank, event, referendumIndex, referendumTitle } = data;

  return (
    <div
      className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-full"
      style={{ left: x, top: y }}
    >
      <div className="rounded py-1.5 px-3 text12Normal text-white bg-tooltipBg">
        <div>{dayjs(time).format("YYYY-MM-DD")}</div>
        <div>Rank: {rank}</div>
        {EVENT_NAMES[event] && <div>Event: {EVENT_NAMES[event]}</div>}
        {referendumIndex != null && (
          <div className="pointer-events-auto">
            <Link
              href={`/${section}/referenda/${referendumIndex}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Referendum #{referendumIndex}
              {referendumTitle ? ` · ${referendumTitle}` : ""}
            </Link>
          </div>
        )}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
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
  const { id } = usePageProps();
  const { section } = useCollectivesContext();
  const rankHistoryApi =
    section === "ambassador"
      ? ambassadorStatisticsMemberRankHistoryApi(id)
      : fellowshipStatisticsMemberRankHistoryApi(id);

  const { value, loading } = useAsync(async () => {
    if (!rankHistoryApi) {
      return {};
    }

    try {
      const resp = await backendApi.fetch(rankHistoryApi);
      return resp?.result || {};
    } catch {
      return {};
    }
  }, [rankHistoryApi]);

  const theme = useThemeSetting();

  const { points } = useMemo(
    () => buildRankChartData(value?.points || []),
    [value],
  );

  const [tooltip, setTooltip] = useState(null);

  const externalTooltip = useCallback(({ tooltip: tooltipModel }) => {
    if (!tooltipModel || tooltipModel.opacity === 0) {
      setTooltip(null);
      return;
    }

    const dataPoint = tooltipModel.dataPoints?.[0];
    const point = dataPoint?.raw;
    if (!point) {
      setTooltip(null);
      return;
    }

    setTooltip({
      x: tooltipModel.caretX,
      y: tooltipModel.caretY,
      data: point,
    });
  }, []);

  if (loading) {
    return (
      <div style={{ height: CHART_HEIGHT }}>
        <LoadingContent />
      </div>
    );
  }

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

  const chartData = {
    datasets: [
      {
        label: "Rank",
        data: points,
        borderColor: theme.theme500,
        backgroundColor: theme.theme100,
        borderWidth: 2,
        pointRadius: (ctx) => (ctx.dataIndex === points.length - 1 ? 0 : 3),
        pointBackgroundColor: theme.theme500,
        pointBorderColor: theme.theme500,
        pointBorderWidth: 0,
        pointHoverRadius: 5,
        pointHitRadius: 10,
        fill: true,
        stepped: true,
      },
    ],
  };

  const options = {
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
  };

  return (
    <div className="w-full relative" style={{ height: CHART_HEIGHT }}>
      <Line data={chartData} options={options} />
      <RankChartTooltip
        x={tooltip?.x}
        y={tooltip?.y}
        visible={!!tooltip}
        data={tooltip?.data}
        section={section}
      />
    </div>
  );
}
