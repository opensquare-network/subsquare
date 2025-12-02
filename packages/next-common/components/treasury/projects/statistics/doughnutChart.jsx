import ProjectChart, { PROJECT_CHART_TYPES } from "./projectChart";

export default function ProjectDoughnutChart({ data }) {
  return (
    <ProjectChart
      type={PROJECT_CHART_TYPES.DOUGHNUT}
      data={data}
      category={data?.category}
    />
  );
}
