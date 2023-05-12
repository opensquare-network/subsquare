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
import deepmerge from "deepmerge";

const Wrapper = styled.div``;
const ChartWrapper = styled.div`
  height: 256px;
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
  noLegend,
  options: userOptions = {},
}) {
  const options = useOptions(userOptions);

  return (
    <Wrapper>
      <ChartWrapper>
        <Bar data={data} options={options} />
      </ChartWrapper>

      {!noLegend && (
        <Legend>
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
        </Legend>
      )}
    </Wrapper>
  );
}
