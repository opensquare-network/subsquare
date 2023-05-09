"use client";

import React from "react";
import BarChart from "../barChart";
import { useChainSettings } from "next-common/context/chain";
import { abbreviateBigNumber, toPrecisionNumber } from "next-common/utils";
import startCase from "lodash.startcase";

export default function TrackDelegationChart({ tracks }) {
  const { decimals, symbol } = useChainSettings();

  const labels = tracks.map((track) => startCase(track.trackName));
  const datasets = [
    {
      categoryPercentage: 0.8,
      barPercentage: 0.6,
      label: "Capital",
      data: tracks.map((track) =>
        toPrecisionNumber(track.statistics?.votes?.capital, decimals),
      ),
      backgroundColor: "rgba(15, 111, 255, 0.4)",
    },
    {
      categoryPercentage: 0.8,
      barPercentage: 0.6,
      label: "Votes",
      data: tracks.map((track) =>
        toPrecisionNumber(track.statistics?.votes?.votes, decimals),
      ),
      backgroundColor: "rgba(255, 152, 0, 0.4)",
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
                const raw = item.raw;
                return `${item.dataset.label}: ${abbreviateBigNumber(
                  raw,
                )} ${symbol}`;
              },
            },
          },
        },
      }}
    />
  );
}
