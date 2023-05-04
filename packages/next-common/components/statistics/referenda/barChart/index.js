import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  // Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  // Title,
  Tooltip,
  Legend,
);

export const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    // title: {
    //   display: true,
    //   text: "Chart.js Horizontal Bar Chart",
    // },
  },
};

export default function BarChart({ data }) {
  return <Bar data={data} options={options} />;
}
