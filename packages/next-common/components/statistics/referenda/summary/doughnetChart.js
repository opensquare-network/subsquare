import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";
import { TrackColors } from "./colors";
import startCase from "lodash.startcase";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      displayColors: false,
      callbacks: {
        title: () => "",
        label(item) {
          const name = item.dataset.name[item.dataIndex];
          const percentage = item.dataset.percentage[item.dataIndex];
          const count = item.dataset.data[item.dataIndex];
          return `${name}: ${count} (${percentage})`;
        },
      },
    },
  },
  cutout: "80%",
};


const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

export function DoughnutChart({ trackReferendaCounts }) {
  const data = {
    labels: trackReferendaCounts.map(item => startCase(item.name)),
    datasets: [
      {
        label: "Referendum Count",
        data: trackReferendaCounts.map(item => item.count),
        backgroundColor: trackReferendaCounts.map(item => TrackColors[item.name]),
        borderColor: trackReferendaCounts.map(item => TrackColors[item.name]),
        borderWidth: 0,
        name: trackReferendaCounts.map(item => startCase(item.name)),
        percentage: trackReferendaCounts.map(item => `${(item.percent * 100).toFixed(2)}%`),
      },
    ],
  };

  return (
    <Wrapper>
      <div style={{ width: 240, height: 240 }}>
        <Doughnut data={data} options={options} />
      </div>
    </Wrapper>
  );
}
