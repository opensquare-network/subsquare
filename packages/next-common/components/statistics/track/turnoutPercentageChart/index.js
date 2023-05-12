"use client";

import React from "react";
import BarChart from "../barChart";

export default function TurnoutPercentageChartChart({ turnout }) {
  const categoryPercentage = 0.5;
  const barPercentage = 0.4;

  const labels = turnout.map((item) => item.referendumIndex);
  const datasets = [
    {
      categoryPercentage,
      barPercentage,
      label: "Turnout Percentage",
      data: turnout.map((item) => item.percentage * 100),
      backgroundColor: "rgba(104, 72, 255, 0.4)",
    },
  ];

  const data = {
    labels,
    datasets,
  };

  return (
    <BarChart
      data={data}
      noLegend={true}
      options={{
        scales: {
          y: {
            ticks: {
              callback: (val) => `${val}%`,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title(item) {
                const index = item[0].dataIndex;
                return `Referendum #${labels[index]}`;
              },
              label(item) {
                const raw = item.raw;
                return `${item.dataset.label}: ${raw.toFixed(2)}%`;
              },
            },
          },
        },
      }}
    />
  );
}
