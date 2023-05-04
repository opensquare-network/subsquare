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
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      categoryPercentage: 0.8,
      barPercentage: 0.6,
      label: "Delegatee",
      data: tracks.map((track) => track.statistics?.addresses?.delegatee),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ];

  const data = {
    labels,
    datasets,
  };

  return <BarChart data={data} />;
}
