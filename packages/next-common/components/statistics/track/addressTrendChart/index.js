"use client";

import React, { useCallback, useState } from "react";
import BarChart from "../barChart";
import { abbreviateBigNumber } from "next-common/utils";
import ReferendaSlider from "../../RefereundaSlider";

export default function AddressTrendChart({ turnout, delegated }) {
  const categoryPercentage = 0.7;
  const barPercentage = 0.7;
  const [rangeTo, setRangeTo] = useState(turnout ? turnout.length - 1 : 0);
  const [rangeFrom, setRangeFrom] = useState(Math.max(0, rangeTo - 100));

  const onSliderChange = useCallback(([from, to]) => {
    setRangeFrom(from);
    setRangeTo(to);
  }, []);

  const partialTurnout = turnout.slice(rangeFrom, rangeTo + 1);
  const labels = partialTurnout.map((item) => item.referendumIndex);
  let datasets = [
    {
      categoryPercentage,
      barPercentage,
      label: "Direct",
      data: partialTurnout.map((item) => item.directAddresses),
      backgroundColor: "rgba(76, 175, 80, 0.4)",
    },
  ];
  if (delegated) {
    datasets = [
      ...datasets,
      {
        categoryPercentage,
        barPercentage,
        label: "Delegated",
        data: partialTurnout.map((item) => item.delegationAddresses),
        backgroundColor: "rgba(232, 31, 102, 0.4)",
      },
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
      defaultRange={[rangeFrom, rangeTo]}
    />
  );

  return (
    <BarChart
      slider={slider}
      data={data}
      options={{
        animation: {
          duration: 0,
        },
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
                return `${item.dataset.label}: ${abbreviateBigNumber(raw)}`;
              },
            },
          },
        },
      }}
    />
  );
}
