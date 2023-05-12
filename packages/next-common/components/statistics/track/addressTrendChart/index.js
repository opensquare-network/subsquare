"use client";

import React from "react";
import BarChart from "../barChart";
import { abbreviateBigNumber } from "next-common/utils";

export default function AddressTrendChart({ turnout }) {
  const labels = turnout.map((item) => item.referendumIndex);
  const datasets = [
    {
      label: "Direct",
      data: turnout.map((item) => item.directAddresses),
      backgroundColor: "rgba(76, 175, 80, 0.4)",
    },
    {
      label: "Delegated",
      data: turnout.map((item) => item.delegationAddresses),
      backgroundColor: "rgba(232, 31, 102, 0.4)",
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
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
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
                return `${item.dataset.label}: ${abbreviateBigNumber(
                  raw,
                )}`;
              },
            },
          },
        },
      }}
    />
  );
}
