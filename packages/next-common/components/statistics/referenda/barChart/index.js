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
        position: "average",
        displayColors: false,
        xAlign: "left",
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

/**
 * @param {Object} props
 * @param {import("react-chartjs-2").ChartProps} props.options
 */
export default function BarChart({
  data,
  options: userOptions = {},
  noLegend,
  height,
}) {
  const options = useOptions(userOptions);

  return (
    <div>
      <div style={{ height: height || 484 }}>
        <Bar data={data} options={options} />
      </div>

      {!noLegend && (
        <div className="flex items-center justify-center mt-4">
          {data?.datasets?.map?.((item) => {
            if (item.legend === false) {
              return;
            }
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
