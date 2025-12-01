import ProjectChart, { PROJECT_CHART_TYPES } from "./projectChart";

export default function BarChart({
  data,
  userOptions = {},
  height = 184,
  onClick,
}) {
  return (
    <ProjectChart
      type={PROJECT_CHART_TYPES.BAR}
      data={data}
      userOptions={userOptions}
      height={height}
      onClick={onClick}
    />
  );
}
