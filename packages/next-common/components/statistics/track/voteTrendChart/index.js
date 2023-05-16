"use client";

import React, { useCallback, useState } from "react";
import BarChart from "../barChart";
import { abbreviateBigNumber, toPrecisionNumber } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import ReferendaSlider from "../../RefereundaSlider";

export default function VoteTrendChart({ turnout, delegated }) {
  const { decimals, symbol } = useChainSettings();
  const [rangeFrom, setRangeFrom] = useState(0);
  const [rangeTo, setRangeTo] = useState(turnout?.length || 0);

  const onSliderChange = useCallback(([from, to]) => {
    setRangeFrom(from);
    setRangeTo(to);
  }, []);

  const categoryPercentage = 0.7;
  const barPercentage = 0.7;

  const capitalColor = "rgba(15, 111, 255, 0.4)";
  const votesColor = "rgba(255, 152, 0, 0.4)";
  const delegatedColor = "rgba(232, 31, 102, 0.4)";

  const partialTurnout = turnout.slice(rangeFrom, rangeTo + 1);
  const labels = partialTurnout.map((item) => item.referendumIndex);
  let datasets = [
    {
      categoryPercentage,
      barPercentage,
      label: "Capital",
      data: partialTurnout.map((item) =>
        toPrecisionNumber(item.totalCapital, decimals),
      ),
      backgroundColor: capitalColor,
      stack: "Capital",
    },
    {
      categoryPercentage,
      barPercentage,
      label: "Votes",
      data: partialTurnout.map((item) =>
        toPrecisionNumber(item.votes, decimals),
      ),
      backgroundColor: votesColor,
      stack: "Votes",
    },
  ];
  let customLegend = null;

  if (delegated) {
    datasets = [
      {
        categoryPercentage,
        barPercentage,
        label: "Direct Capital",
        data: partialTurnout.map((item) =>
          toPrecisionNumber(item.directCapital, decimals),
        ),
        backgroundColor: capitalColor,
        stack: "Capital",
      },
      {
        categoryPercentage,
        barPercentage,
        label: "Delegation Capital",
        data: partialTurnout.map((item) =>
          toPrecisionNumber(item.delegationCapital, decimals),
        ),
        backgroundColor: delegatedColor,
        stack: "Capital",
        legend: false,
      },
      {
        categoryPercentage,
        barPercentage,
        label: "Direct Votes",
        data: partialTurnout.map(
          (item) =>
            toPrecisionNumber(item.votes, decimals) -
            toPrecisionNumber(item.delegationVotes, decimals),
        ),
        backgroundColor: votesColor,
        stack: "Votes",
      },
      {
        categoryPercentage,
        barPercentage,
        label: "Delegation Votes",
        data: partialTurnout.map((item) =>
          toPrecisionNumber(item.delegationVotes, decimals),
        ),
        backgroundColor: delegatedColor,
        stack: "Votes",
        legend: false,
      },
    ];

    customLegend = [
      { label: "Capital", backgroundColor: capitalColor },
      { label: "Votes", backgroundColor: votesColor },
      { label: "Delegated", backgroundColor: delegatedColor },
    ];
  }

  const data = {
    labels,
    datasets,
  };

  const slider = (
    <ReferendaSlider
      marginLeft={45}
      turnout={turnout}
      onSliderChange={onSliderChange}
    />
  );

  return (
    <>
      <BarChart
        slider={slider}
        data={data}
        customLegend={customLegend}
        options={{
          animation: {
            duration: 0,
          },
          interaction: {
            mode: "x",
          },
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
    </>
  );
}
