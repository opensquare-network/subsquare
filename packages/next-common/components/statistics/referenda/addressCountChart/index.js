import React from "react";
import BarChart from "../barChart";
import startCase from "lodash.startcase";

export default function AddressCountChart({ tracks }) {
  const labels = tracks.map((track) => startCase(track.trackName));
  const datasets = [
    {
      categoryPercentage: 0.8,
      barPercentage: 0.6,
      label: "Delegator",
      data: tracks.map((track) => track.statistics?.addresses?.delegator),
      backgroundColor: "rgba(31, 112, 199, 0.4)",
      inactiveBackgroundColor: "rgba(33, 150, 243, 0.1)",
    },
    {
      categoryPercentage: 0.8,
      barPercentage: 0.6,
      label: "Delegatee",
      data: tracks.map((track) => track.statistics?.addresses?.delegatee),
      backgroundColor: "rgba(232, 31, 102, 0.4)",
      inactiveBackgroundColor: "rgba(232, 31, 102, 0.1)",
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
          tooltip: {
            callbacks: {
              label(item) {
                return `${item.dataset.label} count: ${item.formattedValue}`;
              },
            },
          },
        },
      }}
    />
  );
}
