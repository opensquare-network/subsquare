"use client";

import React from "react";
import BarChart from "../barChart";

export default function TurnoutPercentageChartChart({ turnout }) {
  const labels = turnout.map((item) => item.referendumIndex);
  const datasets = [
    {
      label: "Turnout Percentage",
      data: turnout.map((item) => item.percentage,
      ),
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
      options={{
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title(item) {
                const index = item[0].dataIndex;
                return `Referendum #${labels[index]}`;
              },
              label(item) {
                const raw = item.raw;
                return `${item.dataset.label}: ${raw * 100}%`;
              },
            },
          },
        },
      }}
    />
  );
}
