import ProjectDoughnutChart from "./doughnutChart";
import ProjectIndicators from "./projectIndicators";
import ProjectSummary from "./summary";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import useChartData from "../hooks/useChartData";

export default function ProjectStatisticsChart({
  projects,
  totalFiat,
  category,
}) {
  const isMobile = useIsMobile();
  const data = useChartData({ projects, totalFiat, category });
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
