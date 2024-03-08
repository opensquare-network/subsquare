import React from "react";
import BarChart from "../barChart";
import { startCase } from "lodash-es";

export default function DelegatedAddressChart({ tracks }) {
  const height = (tracks.length + 1) * 30;

  const categoryPercentage = 0.6;
  const barPercentage = 1;

  const labels = tracks.map((track) => startCase(track.trackName));
  const datasets = [
    {
      categoryPercentage,
      barPercentage,
      label: "Delegator",
      data: tracks.map((track) => track.statistics?.addresses?.delegator),
      backgroundColor: "rgba(31, 112, 199, 0.4)",
    },
    {
      categoryPercentage,
      barPercentage,
      label: "placeholder",
      data: tracks.map((track) => track.statistics?.addresses?.delegator),
      backgroundColor: "transparent",
      legend: false,
      tooltip: false,
    },
    {
      categoryPercentage,
      barPercentage,
      label: "Delegatee",
      data: tracks.map((track) => track.statistics?.addresses?.delegatee),
      backgroundColor: "rgba(232, 31, 102, 0.4)",
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
      options={{
        plugins: {
          tooltip: {
            callbacks: {
              label(item) {
                if (item.dataset.tooltip === false) {
                  return "";
                }
                return `${item.dataset.label} count: ${item.formattedValue}`;
              },
            },
          },
        },
      }}
    />
  );
}
