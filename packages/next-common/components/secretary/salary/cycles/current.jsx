import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipSalaryStats from "next-common/components/overview/fellowship/salary/stats";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import FellowshipSalaryStatsActiveCycleDetailLink from "next-common/components/overview/fellowship/salary/detailLink/activeCycle";
import SecretarySalaryPayout from "next-common/components/secretary/salary/actions/payout";
import SecretarySalaryMyStatus from "next-common/components/secretary/salary/cycles/myStatus";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import LoadingSkeleton from "next-common/components/fellowship/salary/cycles/current/loadingSkeleton";
import SecretarySalaryRegister from "next-common/components/secretary/salary/actions/register";

function SecretarySalaryActiveCycleContent() {
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
              <SecretarySalaryMyStatus />

              <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
                <FellowshipSalaryStatsActiveCycleDetailLink />
                <SecretarySalaryRegister />
                <SecretarySalaryPayout />
              </div>
            </div>
          </>
        )}
      </SecondaryCard>
    </>
  );
}

export default function SecretarySalaryActiveCycle() {
  return <SecretarySalaryActiveCycleContent />;
}
