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
          borderColor: projectColors,
          borderWidth: 0,
          percentage: projectPercentages,
        },
      ],
    };
  }, [projects, totalFiat]);

  return (
    <div className="flex flex-wrap gap-6 w-full max-sm:flex-col">
      <div className="flex items-center w-1/2 max-sm:w-full justify-between h-20">
        <ProjectSummary totalFiat={totalFiat} />
        <ProjectDoughnutChart data={data} />
      </div>
      <ProjectIndicators data={data} projects={projects} />
    </div>
  );
}
