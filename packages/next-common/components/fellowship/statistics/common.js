import { useTheme } from "styled-components";
import deepmerge from "deepmerge";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision, formatNum } from "next-common/utils";
import Loading from "next-common/components/loading";

export const expenditureDoughnutChartOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (item) => {
          const name = item.dataset.name[item.dataIndex];
          const percentage = item.dataset.percentage[item.dataIndex];
          const count = item.dataset.data[item.dataIndex];
          return `${name}: ${getAbbreviateBigNumber(count)} (${percentage})`;
        },
      },
    },
  },
};

export const distributionDoughnutChartOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (item) => {
          const name = item.dataset.name[item.dataIndex];
          const percentage = item.dataset.percentage[item.dataIndex];
          const count = item.dataset.data[item.dataIndex];
          return `${name}: ${count} (${percentage})`;
        },
      },
    },
  },
};

export function useDoughnutChartOptions(userOptions = {}) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        position: "average",
        callbacks: {
          title: () => "",
          label: () => "",
        },
      },
    },
    cutout: "80%",
  };
  return deepmerge(options, userOptions);
}

export const doughnutChartColors = [
  "#D5D9E2",
  "#CACED8",
  "#F1CF86",
  "#F5B089",
  "#C3B6FF",
  "#88BEEB",
  "#95D198",
  "#8C96EB",
  "#62D2C9",
  "#E684B8",
];

export function getAbbreviateBigNumber(count, showSymbol = true) {
  const { symbol, decimals } = useSalaryAsset();
  const precisionCount = toPrecision(count, decimals);
  return showSymbol
    ? `${formatNum(precisionCount)} ${symbol}`
    : formatNum(precisionCount);
}

export function useBarChartOptions(userOptions) {
  const theme = useTheme();
  /**
   * @type {import("react-chartjs-2").ChartProps}
   */
  const options = {
    indexAxis: "x",
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
        position: "nearest",
        displayColors: false,
        yAlign: "bottom",
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            size: 12,
            weight: 500,
            style: "normal",
            lineHeight: "16px",
          },
          color: theme.textTertiary,
        },
        grid: {
          drawTicks: false,
          lineWidth: 1,
          color: theme.neutral300,
        },
        border: {
          dash: [5, 5],
          color: theme.neutral300,
        },
      },
      y: {
        stacked: true,
        border: {
          display: true,
          color: theme.neutral300,
        },
        ticks: {
          callback: function (value) {
            return getAbbreviateBigNumber(value, false);
          },
          font: {
            size: 12,
            weight: 500,
            style: "normal",
            lineHeight: "16px",
          },
          color: theme.textTertiary,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return deepmerge(options, userOptions);
}

export function getUniqueRanks(members) {
  const rankSet = new Set();
  members.forEach((item) => rankSet.add(item.rank));
  return Array.from(rankSet).sort((a, b) => a - b);
}

export function translateCollectiveMembersRankData(members) {
  const result = {};
  const totalCount = members.length;

  members.forEach((item) => {
    const rank = item.rank;
    if (!result[rank]) {
      result[rank] = { count: 0, percent: 0 };
    }
    result[rank].count += 1;
  });

  for (const rank in result) {
    result[rank].percent = result[rank].count / totalCount;
  }

  return result;
}

export function getPercentageValue(percent) {
  return percent ? `${(percent * 100).toFixed(2)}%` : "0%";
}

export function LoadingContent(size = 24) {
  return (
    <div className="flex justify-center items-center grow w-full h-full">
      <Loading size={24} />
    </div>
  );
}
