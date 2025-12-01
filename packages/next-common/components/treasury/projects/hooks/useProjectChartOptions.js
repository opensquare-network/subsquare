import { useMemo } from "react";
import { PROJECT_CHART_TYPES } from "../statistics/projectChart";
import { formatNum } from "next-common/utils";
import { useThemeSetting } from "next-common/context/theme";

export default function useProjectChartOptions({
  type,
  barOptions,
  doughnutOptions,
  barLeftPadding,
  data,
  onClick,
}) {
  const { textPrimary } = useThemeSetting();
  return useMemo(() => {
    const baseOptions =
      type === PROJECT_CHART_TYPES.BAR ? barOptions : doughnutOptions;

    let options = baseOptions;

    if (type === PROJECT_CHART_TYPES.BAR) {
      options = {
        ...options,
        layout: {
          ...options.layout,
          padding: {
            ...options.layout?.padding,
            ...(barLeftPadding ? { left: barLeftPadding } : {}),
          },
        },
        plugins: {
          ...options.plugins,
          datalabels: {
            ...(options.plugins?.datalabels || {}),
            anchor: "start",
            align: "start",
            clamp: false,
            clip: false,
            color: textPrimary,
            formatter: (value, context) => {
              const index = context.dataIndex;
              return `${data?.labels?.[index]} ${formatNum(value)}` ?? "";
            },
            listeners: {
              enter: (context) => {
                const chart = context.chart;
                chart.$hoveredLabel = {
                  datasetIndex: context.datasetIndex,
                  dataIndex: context.dataIndex,
                };

                if (chart.canvas) {
                  chart.canvas.style.cursor = "pointer";
                }

                return true;
              },
              leave: (context) => {
                const chart = context.chart;
                if (
                  chart.$hoveredLabel &&
                  chart.$hoveredLabel.datasetIndex === context.datasetIndex &&
                  chart.$hoveredLabel.dataIndex === context.dataIndex
                ) {
                  chart.$hoveredLabel = null;
                }

                if (chart.canvas) {
                  chart.canvas.style.cursor = "default";
                }

                return true;
              },
              click: (context) => {
                const datasetIndex = context.datasetIndex;
                const index = context.dataIndex;
                const label = data?.labels?.[index];
                const value = data?.datasets?.[datasetIndex]?.data?.[index];

                if (label !== undefined) {
                  onClick({
                    label,
                    value,
                    index,
                    datasetIndex,
                    element: context,
                  });
                }
              },
            },
            font: () => ({
              size: 12,
              weight: 500,
            }),
          },
        },
      };
    }

    return options;
  }, [
    type,
    barOptions,
    doughnutOptions,
    barLeftPadding,
    data,
    onClick,
    textPrimary,
  ]);
}
