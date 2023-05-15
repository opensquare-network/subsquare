import React from "react";
import { Bar } from "react-chartjs-2";
import "../../../charts/globalConfig";
import styled, { css, useTheme } from "styled-components";
import LegendItem from "../../../charts/legend/item";
import {
  flex,
  items_center,
  justify_center,
  m_t,
} from "next-common/styles/tailwindcss";
import deepmerge from "deepmerge";
import { pretty_scroll_bar } from "next-common/styles/componentCss";

const Wrapper = styled.div``;

const ChartScrollWrapper = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  ${pretty_scroll_bar}
`;

const ChartWrapper = styled.div`
  height: 256px;
  ${(p) =>
    p.minWidth &&
    css`
      min-width: ${p.minWidth}px;
    `}
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
}) {
  const options = useOptions(userOptions);
  const legendItems =
    customLegend || data?.datasets?.filter((item) => item.legend !== false);

  return (
    <Wrapper>
      <ChartScrollWrapper>
        <ChartWrapper minWidth={minWidth}>
          <Bar data={data} options={options} />
        </ChartWrapper>
      </ChartScrollWrapper>

      {!noLegend && (
        <Legend>
          {legendItems?.map?.((item) => {
            return (
              <LegendItem key={item.label} color={item.backgroundColor}>
                {item.label}
              </LegendItem>
            );
          })}
        </Legend>
      )}
    </Wrapper>
  );
}
