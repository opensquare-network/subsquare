import React, { useCallback, useState } from "react";
import { abbreviateBigNumber, toPrecisionNumber } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import ReferendaSlider from "next-common/components/statistics/RefereundaSlider";
import BarChart from "next-common/components/statistics/track/barChart";

export default function VoteTrendChart({ turnout, height }) {
  const { decimals, voteSymbol } = useChainSettings();
  const [rangeTo, setRangeTo] = useState(turnout ? turnout.length - 1 : 0);
  const [rangeFrom, setRangeFrom] = useState(Math.max(0, rangeTo - 100));

  const onSliderChange = useCallback(([from, to]) => {
    setRangeFrom(from);
    setRangeTo(to);
  }, []);

  const categoryPercentage = 0.7;
  const barPercentage = 0.7;

  const votesColor = "rgba(255, 152, 0, 0.4)";

  const partialTurnout = turnout?.slice(rangeFrom, rangeTo + 1) || [];
  const labels = partialTurnout.map((item) => item.referendumIndex);
  let datasets = [
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
      height={height}
      noLegend={true}
      slider={slider}
      data={data}
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
                )} ${voteSymbol}`;
              },
            },
          },
        },
      }}
    />
  );
}
