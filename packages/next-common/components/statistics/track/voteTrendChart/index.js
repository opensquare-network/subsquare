"use client";

import React from "react";
import BarChart from "../barChart";
import { abbreviateBigNumber, toPrecisionNumber } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

export default function VoteTrendChart({ turnout }) {
  const { decimals, symbol } = useChainSettings();

  const labels = turnout.map((item) => item.referendumIndex);
  const datasets = [
    {
      label: "Capital",
      data: turnout.map((item) => toPrecisionNumber(item.support, decimals)),
      backgroundColor: "rgba(15, 111, 255, 0.4)",
    },
    {
      label: "Votes",
      data: turnout.map((item) => toPrecisionNumber(item.votes, decimals)),
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
              title(item) {
                const index = item[0].dataIndex;
                return `Referendum #${labels[index]}`;
              },
              label(item) {
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
