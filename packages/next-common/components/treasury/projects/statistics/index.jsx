import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProjectSummary from "./summary";
import { Skeleton } from "next-common/components/skeleton";
import ProjectStatisticsChart from "./chart";
import useTreasuryProjects from "../hooks/useProjects";

export default function Statistics() {
  const { projects, loading } = useTreasuryProjects();

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
    <div>
      <TitleContainer className="justify-start mb-4">Wallet</TitleContainer>
      <SecondaryCard className="flex gap-6 max-sm:flex-col">
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
    </div>
  );
}
