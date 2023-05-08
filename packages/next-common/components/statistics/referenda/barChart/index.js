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

const Wrapper = styled.div``;

const Legend = styled.div`
  ${flex};
  ${items_center};
  ${justify_center};
  ${m_t(16)};
`;

function useOptions() {
  const theme = useTheme();

  /**
   * @type {import("react-chartjs-2").ChartProps}
   */
  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      // title: {
      //   display: true,
      //   text: "Chart.js Horizontal Bar Chart",
      // },
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
            size: 14,
          },
          color: theme.textPrimary,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return options;
}

export default function BarChart({ data }) {
  const options = useOptions();

  return (
    <Wrapper>
      <Bar data={data} options={options} />

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
