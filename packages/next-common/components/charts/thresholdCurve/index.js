import React from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import "../globalConfig";
import ThresholdCurvesLegend from "./legend";
import light from "../../styled/theme/light";
import dark from "../../styled/theme/dark";
import { range } from "../../../utils/array";

const Wrapper = styled.div``;

export default function CurveChart({ width, height }) {
  const chartData = {
    labels: range(600),
    datasets: [
      {
        label: "Support",
        data: range(600),
        tension: 0.1,
        pointBorderColor: dark.primaryDarkBlue,
        pointRadius: 1,
        pointHitRadius: 10,
        pointHoverRadius: 5,
      },
      {
        label: "Approval",
        data: range(600)
          .map((n) => (n -= 100))
          .sort((a, b) => b - a),
        tension: 0.1,
        pointBorderColor: light.secondaryGreen500,
        pointRadius: 1,
        pointHitRadius: 10,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        display: false,
        ticks: {
          stepSize: 200,
          callback(val) {
            return val + "hs";
          },
        },
      },
      y: {
        display: false,
        ticks: {
          stepSize: 25,
          callback(val, _index, ticks) {
            const max = ticks[ticks.length - 1].value;
            const step = (val / max) * 100;
            return step % 25 === 0 ? `${step}%` : "";
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        position: "nearest",
        displayColors: false,
        callbacks: {
          title() {
            return ``;
          },
          label(tooltipItem) {
            const { dataIndex, parsed, dataset } = tooltipItem;

            // only display one
            if (dataset.label === "Approval") {
              return ``;
            }

            const supportData = chartData.datasets[0].data[dataIndex];
            const approvalData = chartData.datasets[1].data[dataIndex];

            const hs = parsed.x;
            const percentage = 100;

            const supportPercentage = `TODO`;
            const approvalPercentage = `TODO`;

            const result = `Time: ${hs}hs Support: ${supportPercentage}% Approval: ${approvalPercentage}%`;

            return result;
          },
        },
      },
    },
  };

  return (
    <Wrapper>
      <Line data={chartData} options={options} height={height} width={width} />

      <ThresholdCurvesLegend />
    </Wrapper>
  );
}
