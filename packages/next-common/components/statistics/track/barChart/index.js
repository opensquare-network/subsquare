import React from "react";
import { Bar } from "react-chartjs-2";
import "../../../charts/globalConfig";
import { useTheme } from "styled-components";
import LegendItem from "../../../charts/legend/item";
import deepmerge from "deepmerge";

function useOptions(userOptions) {
  const theme = useTheme();

  /**
   * @type {import("react-chartjs-2").ChartProps}
   */
  const options = {
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
        position: "average",
        displayColors: false,
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: theme.textTertiary,
        },
      },
      y: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: theme.textTertiary,
        },
      },
    },
  };

  return deepmerge(options, userOptions);
}

/**
 * @param {Object} props
 * @param {import("react-chartjs-2").ChartProps} props.options
 */
export default function BarChart({
  data,
  customLegend,
  noLegend,
  options: userOptions = {},
  minWidth,
  slider,
  height = 256,
}) {
  const options = useOptions(userOptions);
  const legendItems =
    customLegend || data?.datasets?.filter((item) => item.legend !== false);

  return (
    <div>
      <div className="overflow-x-auto overflow-y-hidden scrollbar-pretty">
        <div style={{ height, minWidth }}>
          <Bar data={data} options={options} />
        </div>
      </div>
      {slider}
      {!noLegend && (
        <div className="flex items-center justify-center mt-4">
          {legendItems?.map?.((item) => {
            return (
              <LegendItem key={item.label} color={item.backgroundColor}>
                {item.label}
              </LegendItem>
            );
          })}
        </div>
      )}
    </div>
  );
}
