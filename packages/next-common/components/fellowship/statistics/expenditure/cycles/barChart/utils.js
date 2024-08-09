import { useTheme } from "styled-components";
import deepmerge from "deepmerge";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision, abbreviateBigNumber } from "next-common/utils";

export function getAbbreviateBigNumber(count, showSymbol = true) {
  const { symbol, decimals } = useSalaryAsset();
  const precisionCount = toPrecision(count, decimals);
  if (!showSymbol) {
    return abbreviateBigNumber(precisionCount);
  }
  return `${abbreviateBigNumber(precisionCount)} ${symbol}`;
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
    interaction: {
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
        border: {
          display: true,
        },
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
          display: false,
        },
      },
      y: {
        stacked: true,
        border: {
          display: true,
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
