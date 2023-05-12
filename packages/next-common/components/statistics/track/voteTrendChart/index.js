"use client";

import React from "react";
import BarChart from "../barChart";
import { abbreviateBigNumber, toPrecisionNumber } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

export default function VoteTrendChart({ turnout, delegated }) {
  const { decimals, symbol } = useChainSettings();

  const categoryPercentage = 0.5;
  const barPercentage = 0.7;

  const labels = turnout.map((item) => item.referendumIndex);
  let datasets = [
    {
      categoryPercentage,
      barPercentage,
      label: "Capital",
      data: turnout.map((item) => toPrecisionNumber(item.totalCapital, decimals)),
      backgroundColor: "rgba(15, 111, 255, 0.4)",
      stack: "Capital",
    },
    {
      categoryPercentage,
      barPercentage,
      label: "Votes",
      data: turnout.map((item) => toPrecisionNumber(item.votes, decimals)),
      backgroundColor: "rgba(255, 152, 0, 0.4)",
      stack: "Votes",
    },
  ];

  if (delegated) {
    datasets = [
      {
        categoryPercentage,
        barPercentage,
        label: "Capital",
        data: turnout.map((item) => toPrecisionNumber(item.directCapital, decimals)),
        backgroundColor: "rgba(15, 111, 255, 0.4)",
        stack: "Capital",
      },
      {
        categoryPercentage,
        barPercentage,
        label: "Votes",
        data: turnout.map((item) => toPrecisionNumber(item.votes, decimals) - toPrecisionNumber(item.delegationVotes, decimals)),
        backgroundColor: "rgba(255, 152, 0, 0.4)",
        stack: "Votes",
      },
      {
        categoryPercentage,
        barPercentage,
        label: "Delegation Capital",
        data: turnout.map((item) => toPrecisionNumber(item.delegationCapital, decimals)),
        backgroundColor: "rgba(232, 31, 102, 0.4)",
        stack: "Capital",
        legend: false,
      },
      {
        categoryPercentage,
        barPercentage,
        label: "Delegation Votes",
        data: turnout.map((item) => toPrecisionNumber(item.delegationVotes, decimals)),
        backgroundColor: "rgba(232, 31, 102, 0.4)",
        stack: "Votes",
        legend: false,
      },
    ];
  }

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
            ticks: {
              callback: (val) => abbreviateBigNumber(val),
            },
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
