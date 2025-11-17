import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProjectStatisticsChart from "./chart";
import { usePageProps } from "next-common/context/page";

export default function Statistics() {
  const { projects = [] } = usePageProps();

  const totalFiat = useMemo(() => {
    if (!projects?.length) {
      return BigNumber(0);
    }
    return projects.reduce(
      (acc, project) => acc.plus(BigNumber(project.fiatAtFinal)),
      BigNumber(0),
    );
  }, [projects]);

  return (
    <SecondaryCard className="flex gap-6 justify-start w-full max-sm:flex-col">
      <ProjectStatisticsChart projects={projects} totalFiat={totalFiat} />
    </SecondaryCard>
  );
}
