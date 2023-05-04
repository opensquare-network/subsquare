import React from "react";
import BarChart from "../barChart";
import { useChainSettings } from "next-common/context/chain";
import { toPrecisionNumber } from "next-common/utils";
import startCase from "lodash.startcase";

export default function TrackDelegationChart({ tracks }) {
  const { decimals } = useChainSettings();

  const labels = tracks.map((track) => startCase(track.trackName));
  const datasets = [
    {
      categoryPercentage: 0.8,
      barPercentage: 0.6,
      label: "Capital",
      data: tracks.map((track) =>
        toPrecisionNumber(track.statistics?.votes?.capital, decimals),
      ),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      categoryPercentage: 0.8,
      barPercentage: 0.6,
      label: "Votes",
      data: tracks.map((track) =>
        toPrecisionNumber(track.statistics?.votes?.votes, decimals),
      ),
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
