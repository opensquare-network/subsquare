import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProjectStatisticsChart from "./chart";
import { usePageProps } from "next-common/context/page";
import { lowerCase } from "lodash-es";

export default function Statistics({ category }) {
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

  return (
    <SecondaryCard className="flex gap-6 justify-start w-full max-sm:flex-col">
      <ProjectStatisticsChart
        projects={categoryProjects}
        totalFiat={totalFiat}
      />
    </SecondaryCard>
  );
}
