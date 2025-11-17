import { useMemo } from "react";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import LoadableContent from "next-common/components/common/loadableContent";

export default function ProjectStatisticsSummary({
  totalFiat,
  projects,
  loading,
}) {
  const counts = useMemo(() => {
    let proposalsCount = 0;
    let spendsCount = 0;

    projects?.forEach((project) => {
      proposalsCount += project.proposals?.length ?? 0;
      spendsCount += project.spends?.length ?? 0;
    });

    return {
      proposalsCount,
      spendsCount,
      allCount: proposalsCount + spendsCount,
    };
  }, [projects]);

  return (
    <SummaryLayout className="w-auto grid-cols-1 max-sm:w-full max-sm:flex-col">
      <SummaryItem title="Category Total">
        <LoadableContent isLoading={loading}>
          <ValueDisplay value={toPrecision(totalFiat)} symbol="" prefix="$" />
        </LoadableContent>
      </SummaryItem>
      <SummaryItem title="Proposals Total">
        <LoadableContent isLoading={loading}>
          <ValueDisplay value={counts.allCount} symbol="" />
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}
