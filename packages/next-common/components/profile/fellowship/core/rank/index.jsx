import { Line } from "react-chartjs-2";
import "next-common/components/charts/globalConfig";
import dayjs from "dayjs";
import { useMemo } from "react";
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

const CHART_HEIGHT = 360;

// The maximum rank value on chain (fellowship / ambassador both range 0~9)
const MAX_RANK = FELLOWSHIP_RANK_LEVEL_NAMES.length - 1;

function getYearMonth(time) {
  return dayjs(time).format("YYYY-MM");
}

/**
 * Build a month-by-month rank series from the rank change points returned by
 * the backend. The chart spans from the first month the member holds a rank
 * greater than 0 to the current month.
 * @param {Array<{time: number, rank: number}>} points
 */
export function buildRankChartData(points = []) {
  const monthRankMap = {};
  for (const point of points) {
    if (!point?.time || Number.isNaN(Number(point.time))) {
      continue;
    }
    monthRankMap[getYearMonth(point.time)] = point.rank;
  }

  const months = Object.keys(monthRankMap).sort();
  const firstPositiveMonth = months.find((month) => monthRankMap[month] > 0);
  if (!firstPositiveMonth) {
    return { labels: [], data: [] };
  }

  const labels = [];
  const data = [];
  let currentRank = 0;
  let cursor = dayjs(`${firstPositiveMonth}-01`);
  const end = dayjs().startOf("month");

  while (cursor.isBefore(end) || cursor.isSame(end, "month")) {
    const ym = cursor.format("YYYY-MM");
    labels.push(ym);
    if (monthRankMap[ym] !== undefined) {
      currentRank = monthRankMap[ym];
    }
    data.push(currentRank);
    cursor = cursor.add(1, "month");
  }

  return { labels, data };
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

  const { labels, data: rankData } = useMemo(
    () => buildRankChartData(value?.points || []),
    [value],
  );

  if (loading) {
    return (
      <div style={{ height: CHART_HEIGHT }}>
        <LoadingContent />
      </div>
    );
  }

  if (!labels.length) {
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
    labels,
    datasets: [
      {
        label: "Rank",
        data: rankData,
        borderColor: theme.theme500,
        backgroundColor: theme.theme100,
        borderWidth: 2,
        pointRadius: 2,
        pointBackgroundColor: theme.theme500,
        pointBorderColor: theme.theme500,
        pointBorderWidth: 0,
        pointHoverRadius: 4,
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
        displayColors: false,
        callbacks: {
          title: (items) => items?.[0]?.label || "",
          label: (item) => `Rank: ${item.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.textTertiary,
          maxRotation: 0,
          autoSkip: true,
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
    <div className="w-full" style={{ height: CHART_HEIGHT }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
