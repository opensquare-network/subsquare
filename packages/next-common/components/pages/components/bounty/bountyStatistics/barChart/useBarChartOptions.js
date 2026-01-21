import { formatNum } from "next-common/utils";
import { useMemo } from "react";
import { useTheme } from "styled-components";

export function useBarChartOptions() {
  const theme = useTheme();

  return useMemo(
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
            title: (items) => {
              const item = items[0];
              return `${item.label}`;
            },
            label: (item) => {
              const percentage = item.dataset.percentage[item.dataIndex];
              return `${formatNum(item.raw)} (${percentage})`;
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
}
