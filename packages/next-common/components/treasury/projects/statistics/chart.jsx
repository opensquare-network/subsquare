import { useMemo } from "react";
import { colors } from "./doughnutChart";
import BigNumber from "bignumber.js";
import ProjectDoughnutChart from "./doughnutChart";
import ProjectIndicators from "./projectIndicators";
import ProjectSummary from "./summary";

export default function ProjectStatisticsChart({ projects, totalFiat }) {
  const data = useMemo(() => {
    if (!projects?.length) {
      return null;
    }
    const projectColors = projects.map(
      (_, index) => colors[index % colors.length],
    );
    const projectNames = projects.map((project) => project.name);
    const projectFiatAtFinals = projects.map((project) => project.fiatAtFinal);
    const projectPercentages = projects.map(
      (project) =>
        BigNumber(project.fiatAtFinal)
          .dividedBy(totalFiat)
          .multipliedBy(100)
          .toFixed(2) + "%",
    );

    return {
      labels: projectNames,
      datasets: [
        {
          label: "Projects",
          data: projectFiatAtFinals,
          name: projectNames,
          backgroundColor: projectColors,
          borderColor: "#ffffff",
          borderWidth: 2,
          hoverBorderColor: "#ffffff",
          hoverBorderWidth: 2,
          borderRadius: 5,
          spacing: 0,
          percentage: projectPercentages,
        },
      ],
    };
  }, [projects, totalFiat]);

  return (
    <div className="grid grid-cols-3 w-full max-sm:grid-cols-1 items-center">
      <ProjectSummary totalFiat={totalFiat} />
      <ProjectIndicators data={data} projects={projects} />
      <ProjectDoughnutChart data={data} />
    </div>
  );
}
