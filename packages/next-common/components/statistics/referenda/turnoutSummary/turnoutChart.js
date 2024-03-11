import React from "react";
import { startCase } from "lodash-es";
import BarChart from "../barChart";

export default function TurnoutChart({ turnouts }) {
  const categoryPercentage = 0.2;
  const barPercentage = 1;

  const height = (turnouts.length + 1) * 30;

  const labels = turnouts.map((track) => startCase(track.name));
  const datasets = [
    {
      categoryPercentage,
      barPercentage,
      label: "Turnout Percentage",
      data: turnouts.map((track) => track.percentage * 100),
      backgroundColor: "rgba(104, 72, 255, 0.4)",
    },
  ];

  const data = {
    labels,
    datasets,
  };

  return (
    <BarChart
      height={height}
      data={data}
      noLegend={true}
      options={{
        plugins: {
          tooltip: {
            callbacks: {
              title: () => "",
              label(item) {
                const raw = item.raw;
                const name = labels[item.dataIndex];
                return `${name}: ${raw.toFixed(2)}%`;
              },
            },
          },
        },
      }}
    />
  );
}
