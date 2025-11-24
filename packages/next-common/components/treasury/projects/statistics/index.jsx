import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProjectStatisticsChart from "./chart";
import { usePageProps } from "next-common/context/page";
import { lowerCase } from "lodash-es";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Tooltip from "next-common/components/tooltip";

export default function Statistics({ label, category }) {
  const { projects = [] } = usePageProps();

  const categoryProjects = useMemo(() => {
    return projects
      .filter((project) => lowerCase(project.category) === lowerCase(category))
      .sort((a, b) => b.fiatAtFinal - a.fiatAtFinal);
  }, [projects, category]);

  const totalFiat = useMemo(() => {
    if (!categoryProjects?.length) {
      return BigNumber(0);
    }
    return categoryProjects.reduce(
      (acc, project) => acc.plus(BigNumber(project.fiatAtFinal)),
      BigNumber(0),
    );
  }, [categoryProjects]);

  if (categoryProjects?.length === 0) {
    return null;
  }

  return (
    <div>
      <TitleContainer className="justify-start mb-4">
        <div className="flex gap-x-1">
          {label}
          <Tooltip content="The prices are calculated at awarded time."></Tooltip>
        </div>
      </TitleContainer>
      <SecondaryCard className="flex gap-6 justify-start w-full max-sm:flex-col">
        <ProjectStatisticsChart
          projects={categoryProjects}
          totalFiat={totalFiat}
        />
      </SecondaryCard>
    </div>
  );
}
