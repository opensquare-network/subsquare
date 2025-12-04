import { useMemo } from "react";
import { useTheme } from "styled-components";
import { useThemeSetting } from "next-common/context/theme";
import { DOUGHNUT_CONFIG_BY_CATEGORY } from "../const";
import { formatNum } from "next-common/utils";
import deepmerge from "deepmerge";

export function useProjectBarChartOptions(userOptions = {}) {
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

  return useMemo(
    () => deepmerge(baseOptions, userOptions),
    [baseOptions, userOptions],
  );
}

export function useProjectDoughnutChartOptions(category, userOptions = {}) {
  const { textPrimary } = useThemeSetting();

  const baseOptions = useMemo(
    () => ({
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
          enabled: false,
        },
        annotation: {
          display: false,
        },
        outlabels: {
          text: (context) => {
            const percentage =
              context.dataset.percentage?.[context.dataIndex] ?? "";
            return percentage;
          },
          font: {
            size: 11,
            weight: 500,
          },
          color: textPrimary,
          backgroundColor: null,
          lineWidth: 1,
          borderRadius: 0,
          borderWidth: 0,
          padding: 0,
          ...(DOUGHNUT_CONFIG_BY_CATEGORY[category] ?? {}),
        },
      },
      layout: {
        padding: {
          left: 2,
          right: 2,
          top: 1,
          bottom: 0,
        },
      },
      cutout: "45%",
      rotation: 5,
    }),
    [textPrimary, category],
  );

  return useMemo(
    () => deepmerge(baseOptions, userOptions),
    [baseOptions, userOptions],
  );
}
