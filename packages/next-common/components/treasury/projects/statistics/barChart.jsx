import { Bar } from "react-chartjs-2";
import "../../../charts/globalConfig";
import { useTheme } from "styled-components";
import deepmerge from "deepmerge";
import { formatNum } from "next-common/utils";
import { useMemo } from "react";

export function useOptions(userOptions) {
  const theme = useTheme();
  /**
   * @type {import("react-chartjs-2").ChartProps}
   */
  const options = {
    indexAxis: "y",
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
  };

  return deepmerge(options, userOptions);
}

export default function BarChart({
  data,
  userOptions = {},
  height = 184,
  onClick,
}) {
  const baseOptions = useOptions(userOptions);

  const options = useMemo(() => {
    if (!onClick) {
      return baseOptions;
    }

    return {
      ...baseOptions,
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const element = elements[0];
          const datasetIndex = element.datasetIndex;
          const index = element.index;
          const label = data?.labels?.[index];
          const value = data?.datasets?.[datasetIndex]?.data?.[index];

          onClick({ label, value, index, datasetIndex, element });
        }
      },
    };
  }, [baseOptions, onClick, data]);

  return (
    <div style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
}
