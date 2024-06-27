// import AmbassadorSalaryStatsActiveCycleDetailLink from "next-common/components/overview/ambassador/salary/detailLink/activeCycle";
import AmbassadorSalaryStats from "next-common/components/overview/ambassador/salary/stats";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export default function AmbassadorSalaryCurrentCycle() {
  return (
    <div>
      <TitleContainer className="mb-4">Current Cycle</TitleContainer>

      <SecondaryCard>
        <AmbassadorSalaryStats />

        {/* <hr className="my-4" />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-end gap-x-4">
            <AmbassadorSalaryStatsActiveCycleDetailLink />
          </div>
        </div> */}
      </SecondaryCard>
    </div>
  );
}
