import { Doughnut } from "react-chartjs-2";
import useDoughnutChartOptions from "./useDoughnutChartOptions";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Outlabels from "@energiency/chartjs-plugin-piechart-outlabels";
import "../../../../../charts/globalConfig";

ChartJS.register(ArcElement, Tooltip, Legend, Outlabels);

export default function DoughnutChart({ data }) {
  const doughnutOptions = useDoughnutChartOptions();
  if (!data) {
    return null;
  }
  return (
    <div className="relative flex gap-x-2 w-[190px] h-[110px]">
      <Doughnut data={data} options={doughnutOptions} />
    </div>
  );
}
