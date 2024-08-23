import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipSalaryStats from "next-common/components/overview/fellowship/salary/stats";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Link from "next/link";
import FellowshipSalaryStatsActiveCycleDetailLink from "./detailLink/activeCycle";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function FellowshipSalaryOverview() {
  return (
    <CollectivesProvider>
      <TitleContainer className="mb-4">Fellowship Salary Cycle</TitleContainer>

      <SecondaryCard>
        <FellowshipSalaryStats />

        <div className="mt-2 flex justify-end gap-x-4">
          <Link
            href="/fellowship/salary"
            className="text14Medium text-theme500"
          >
            All Cycles
          </Link>

          <FellowshipSalaryStatsActiveCycleDetailLink />
        </div>
      </SecondaryCard>
    </CollectivesProvider>
  );
}
