import { useMemo } from "react";
import { colors } from "../const";
import BigNumber from "bignumber.js";
import ProjectDoughnutChart from "./doughnutChart";
import ProjectIndicators from "./projectIndicators";
import ProjectSummary from "./summary";
import { useThemeSetting } from "next-common/context/theme";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";

export default function ProjectStatisticsChart({
  projects,
  totalFiat,
  category,
}) {
  const { neutral100 } = useThemeSetting();
  const isMobile = useIsMobile();

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
      category,
      labels: projectNames,
      datasets: [
        {
          label: "Projects",
          data: projectFiatAtFinals,
          name: projectNames,
          backgroundColor: projectColors,
          borderColor: neutral100,
          borderWidth: 3,
          hoverBorderColor: neutral100,
          hoverBorderWidth: 3,
          borderRadius: 5,
          spacing: 0,
          percentage: projectPercentages,
        },
      ],
    };
  }, [projects, totalFiat, neutral100, category]);

  if (isMobile) {
    return (
      <ProjectStatisticsChartMobile
        data={data}
        projects={projects}
        totalFiat={totalFiat}
      />
    );
  }

  return (
    <div className="grid grid-cols-3 w-full max-md:grid-cols-1 max-md:gap-y-4 items-center">
      <ProjectSummary totalFiat={totalFiat} />
      <ProjectIndicators data={data} projects={projects} />
      <ProjectDoughnutChart data={data} />
    </div>
  );
}

function ProjectStatisticsChartMobile({ data, projects, totalFiat }) {
  return (
    <div className="flex flex-col gap-y-4 items-center">
      <div className="flex justify-between w-full">
        <ProjectSummary totalFiat={totalFiat} />
        <ProjectIndicators data={data} projects={projects} />
      </div>
      <ProjectDoughnutChart data={data} />
    </div>
  );
}
