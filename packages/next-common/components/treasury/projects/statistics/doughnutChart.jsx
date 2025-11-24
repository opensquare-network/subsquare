import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const colors = [
  "#EB558999",
  "#785DF399",
  "#E47E5299",
  "#4CAF9199",
  "#0F6FFF99",
  "#FF980080",
  "#2196F399",
];

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  cutout: "50%",
};

export default function ProjectDoughnutChart({ data }) {
  if (!data) {
    return null;
  }

  return (
    <div style={{ width: 160, height: 80 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
