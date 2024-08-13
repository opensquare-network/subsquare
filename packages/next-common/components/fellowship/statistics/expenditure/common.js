import { useTheme } from "styled-components";
import deepmerge from "deepmerge";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision, abbreviateBigNumber, formatNum } from "next-common/utils";
import { getEffectiveNumbers } from "next-common/utils/viewfuncs";

export const doughnutChartOptions = {
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
      callbacks: {
        title: () => "",
        label: (item) => {
          const name = item.dataset.name[item.dataIndex];
          const percentage = item.dataset.percentage[item.dataIndex];
          const count = item.dataset.data[item.dataIndex];
          return `${name}: ${getAbbreviateBigNumber(count)} (${percentage})`;
        },
      },
    },
  },
  cutout: "80%",
};

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

export function useOptions(userOptions) {
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
