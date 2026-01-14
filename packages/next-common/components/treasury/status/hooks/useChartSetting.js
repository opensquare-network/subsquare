import { useMemo } from "react";
import { useTheme } from "styled-components";
import { formatNum } from "next-common/utils";
import deepmerge from "deepmerge";

export function useBarChartOptions(userOptions = {}) {
  const theme = useTheme();

  const baseOptions = useMemo(
    () => ({
      indexAxis: "y",
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
            title: () => null,
            label: (item) => {
              return `${item.label}: ${formatNum(item.raw)}`;
            },
          },
        },
      },
      scales: {
        x: {
          border: {
            display: false,
          },
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y: {
          border: {
            display: false,
          },
          ticks: {
            display: false,
            font: {
              size: 12,
              weight: 500,
              style: "normal",
              lineHeight: "16px",
            },
            color: theme.textPrimary,
          },
          grid: {
            display: false,
          },
        },
      },
    }),
    [theme],
  );

  return useMemo(
    () => deepmerge(baseOptions, userOptions),
    [baseOptions, userOptions],
  );
}
