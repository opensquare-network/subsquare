import React from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import "../globalConfig";
import { emptyFunction } from "../../../utils";
import hoverLinePlugin from "../plugins/hoverLine";
import { useThemeSetting } from "next-common/context/theme";
import { formatDays, formatHours } from "next-common/utils/timeFormat";

const Wrapper = styled.div``;

export default function ThresholdCurvesChart({
  width,
  height,
  scalesX = true,
  scalesY = true,
  layoutPadding,
  labels = [],
  supportData = [],
  approvalData = [],
  currentSupportData = [],
  currentApprovalData = [],
  beforeDrawOptions = emptyFunction,
}) {
  const { neutral400, purple500, green500, purple300, green300 } =
    useThemeSetting();

  const chartData = {
    labels,
    datasets: [
      {
        label: "Support",
        data: supportData,
        tension: 0.1,
        borderColor: purple500,
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        pointHoverRadius: 5,
      },
      {
        label: "Approval",
        data: approvalData,
        tension: 0.1,
        borderColor: green500,
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        pointHoverRadius: 5,
      },
      {
        label: "Current Support",
        data: currentSupportData,
        tension: 0.1,
        borderDash: [5, 3],
        borderColor: purple300,
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        pointHoverRadius: 5,
      },
      {
        label: "Current Approval",
        data: currentApprovalData,
        tension: 0.1,
        borderDash: [5, 3],
        borderColor: green300,
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    clip: false,
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    layout: {
      padding: layoutPadding,
    },
    scales: {
      x: {
        type: "linear",
        display: scalesX,
        ticks: {
          max: labels.length,
          stepSize: Math.round(labels.length / 3),
          callback(val) {
            return val + "hs";
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: scalesY,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          callback(val) {
            return val + "%";
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
        displayColors: false,
        callbacks: {
          title() {
            return "";
          },
          label(tooltipItem) {
            const { dataIndex, parsed, dataset } = tooltipItem;

            const hs = parsed.x;

            // Display time at the first line
            if (dataset.label === chartData.datasets[0].label) {
              const days = Math.floor(hs / 24);
              const restHs = hs - days * 24;
              let result = `Time: ${formatHours(hs)}`;
              if (days > 0) {
                result =
                  result +
                  ` (${formatDays(days)}${
                    restHs > 0 ? formatHours(restHs) : ""
                  })`;
              }

              return result;
            }

            // Display approval at the second line
            if (dataset.label === chartData.datasets[1].label) {
              const approvalValue = Number(
                chartData.datasets[1].data[dataIndex],
              ).toFixed(2);
              const currentApprovalValue = Number(
                chartData.datasets[3].data[dataIndex],
              ).toFixed(2);

              const result = `Approval: ${currentApprovalValue}% / ${approvalValue}%`;

              return result;
            }

            // Display support at the third line
            if (dataset.label === chartData.datasets[2].label) {
              const supportValue = Number(
                chartData.datasets[0].data[dataIndex],
              ).toFixed(2);
              const currentSupportValue = Number(
                chartData.datasets[2].data[dataIndex],
              ).toFixed(2);

              const result = `Support: ${currentSupportValue}% / ${supportValue}%`;

              return result;
            }

            return "";
          },
        },
      },
      hoverLine: {
        lineColor: neutral400,
        lineWidth: 1,
      },
    },
  };

  // TODO: figure out a better way to modify the options
  beforeDrawOptions?.(options);

  return (
    <Wrapper style={{ height, width }}>
      <Line data={chartData} options={options} plugins={[hoverLinePlugin]} />
    </Wrapper>
  );
}
