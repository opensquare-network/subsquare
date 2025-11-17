import { useMemo } from "react";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export default function ProjectStatisticsSummary({ totalFiat, projects }) {
  const allCount = useMemo(() => {
    return projects?.reduce((acc, project) => {
      return (
        acc + (project.proposals?.length ?? 0) + (project.spends?.length ?? 0)
      );
    }, 0);
  }, [projects]);

  return (
    <SummaryLayout className="w-auto grid-cols-1 max-sm:w-full max-sm:grid-cols-1">
      <SummaryItem title="Category Total">
        <ValueDisplay value={toPrecision(totalFiat)} symbol="" prefix="$" />
      </SummaryItem>
      <SummaryItem title="Proposals Total">
        <ValueDisplay value={allCount} symbol="" />
      </SummaryItem>
    </SummaryLayout>
  );
}
