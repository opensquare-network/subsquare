import React from "react";
import { Bar } from "react-chartjs-2";
import "../../../charts/globalConfig";
import styled, { useTheme } from "styled-components";
import LegendItem from "../../../charts/legend/item";
import {
  flex,
  items_center,
  justify_center,
  m_t,
} from "next-common/styles/tailwindcss";
import { Tooltip } from "chart.js";
import deepmerge from "deepmerge";

Tooltip.positioners.barChartCustomPositioner = function (
  elements,
  eventPosition,
) {
  const pos = Tooltip.positioners.average(elements);

  if (pos === false) {
    return false;
  }

  return {
    x: eventPosition.x,
    y: pos.y,
  };
};

const Wrapper = styled.div``;
const ChartWrapper = styled.div`
  height: 484px;
`;

const Legend = styled.div`
  ${flex};
  ${items_center};
  ${justify_center};
  ${m_t(16)};
`;

function useOptions(userOptions) {
  const theme = useTheme();

  /**
   * @type {import("react-chartjs-2").ChartProps}
   */
  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        position: "barChartCustomPositioner",
        displayColors: false,
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
export default function BarChart({ data, options: userOptions = {} }) {
  const options = useOptions(userOptions);

  return (
    <Wrapper>
      <ChartWrapper>
        <Bar data={data} options={options} />
      </ChartWrapper>

      <Legend>
        {data?.datasets?.map?.((item) => (
          <LegendItem key={item.label} color={item.backgroundColor}>
            {item.label}
          </LegendItem>
        ))}
      </Legend>
    </Wrapper>
  );
}
