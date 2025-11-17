import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProjectSummary from "./summary";
import { Skeleton } from "next-common/components/skeleton";
import ProjectStatisticsChart from "./chart";
import { usePriceType, useProjects } from "../context/projectProvider";

export default function Statistics() {
  const { projects, loading } = useProjects();
  const { priceType } = usePriceType();

  const totalFiat = useMemo(() => {
    if (!projects?.length) {
      return BigNumber(0);
    }
    return projects.reduce(
      (acc, project) => acc.plus(BigNumber(project[priceType])),
      BigNumber(0),
    );
  }, [projects, priceType]);

  return (
    <SecondaryCard className="flex gap-6 justify-start max-sm:flex-col">
      <ProjectSummary
        totalFiat={totalFiat}
        projects={projects}
        loading={loading}
      />
      {loading ? (
        <Skeleton className="w-full rounded-lg h-[120px]" />
      ) : (
        <ProjectStatisticsChart projects={projects} totalFiat={totalFiat} />
      )}
    </SecondaryCard>
  );
}
