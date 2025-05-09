import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipSalaryStats from "next-common/components/overview/fellowship/salary/stats";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import FellowshipSalaryStatsActiveCycleDetailLink from "next-common/components/overview/fellowship/salary/detailLink/activeCycle";
import FellowshipSalaryRegister from "next-common/components/fellowship/salary/actions/register";
import FellowshipSalaryPayout from "next-common/components/fellowship/salary/actions/payout";
import FellowshipSalaryMyStatus from "../myStatus";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import LoadingSkeleton from "./loadingSkeleton";
import FellowshipSalaryNextCycle from "../../actions/bump";

export default function FellowshipSalaryActiveCycle() {
  const stats = useFellowshipSalaryStats();

  return (
    <>
      <TitleContainer className="mb-4">Current Cycle</TitleContainer>

      <SecondaryCard>
        {!stats ? (
          <LoadingSkeleton />
        ) : (
          <>
            <FellowshipSalaryStats />

            <hr className="my-4" />

            <div className="space-y-2">
              <FellowshipSalaryMyStatus />

              <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
                <FellowshipSalaryStatsActiveCycleDetailLink />
                <FellowshipSalaryRegister />
                <FellowshipSalaryPayout />
                <FellowshipSalaryNextCycle />
              </div>
            </div>
          </>
        )}
      </SecondaryCard>
    </>
  );
}
