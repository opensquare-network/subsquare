"use client";

import React from "react";
import BarChart from "../barChart";
import { useChainSettings } from "next-common/context/chain";
import { abbreviateBigNumber, toPrecisionNumber } from "next-common/utils";
import startCase from "lodash.startcase";

export default function TrackDelegationChart({ tracks }) {
  const { decimals, symbol } = useChainSettings();

  const categoryPercentage = 0.6;
  const barPercentage = 1;

  const labels = tracks.map((track) => startCase(track.trackName));
  const datasets = [
    {
      categoryPercentage,
      barPercentage,
      label: "Capital",
      data: tracks.map((track) =>
        toPrecisionNumber(track.statistics?.votes?.capital, decimals),
      ),
      backgroundColor: "rgba(15, 111, 255, 0.4)",
    },
    {
      categoryPercentage,
      barPercentage,
      label: "placeholder",
      data: tracks.map((track) =>
        toPrecisionNumber(track.statistics?.votes?.capital, decimals),
      ),
      backgroundColor: "transparent",
    },
    {
      categoryPercentage,
      barPercentage,
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
                if (item.dataset.label === "placeholder") {
                  return "";
                }

                const raw = item.raw;
                return `${item.dataset.label}: ≈${abbreviateBigNumber(
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
