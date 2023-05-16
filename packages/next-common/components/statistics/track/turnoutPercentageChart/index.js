"use client";

import React, { useCallback, useState } from "react";
import BarChart from "../barChart";
import ReferendaSlider from "../../RefereundaSlider";

export default function TurnoutPercentageChartChart({ turnout }) {
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
  const datasets = [
    {
      categoryPercentage,
      barPercentage,
      label: "Turnout Percentage",
      data: partialTurnout.map((item) => item.percentage * 100),
      backgroundColor: "rgba(104, 72, 255, 0.4)",
    },
  ];

  const data = {
    labels,
    datasets,
  };

  const slider = (
    <ReferendaSlider
      marginLeft={32}
      turnout={turnout}
      onSliderChange={onSliderChange}
      defaultRange={[rangeFrom, rangeTo]}
    />
  );

  return (
    <BarChart
      slider={slider}
      data={data}
      noLegend={true}
      options={{
        animation: {
          duration: 0,
        },
        scales: {
          y: {
            ticks: {
              callback: (val) => `${val}%`,
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
                return `${item.dataset.label}: ${raw.toFixed(2)}%`;
              },
            },
          },
        },
      }}
    />
  );
}
