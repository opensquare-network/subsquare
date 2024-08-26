import { isNil } from "lodash-es";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import AmbassadorSalaryRegister from "../../actions/register";
import AmbassadorSalaryPayout from "../../actions/payout";
import AmbassadorSalaryMyStatus from "../myStatus";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import FellowshipSalaryStats from "next-common/components/overview/fellowship/salary/stats";
import FellowshipSalaryStatsActiveCycleDetailLink from "next-common/components/overview/fellowship/salary/detailLink/activeCycle";

export default function AmbassadorSalaryCurrentCycle() {
  const stats = useFellowshipSalaryStats();

  if (isNil(stats)) {
    return null;
  }

  return (
    <div>
      <TitleContainer className="mb-4">Current Cycle</TitleContainer>

      <SecondaryCard>
        <FellowshipSalaryStats />

        <hr className="my-4" />

        <div className="space-y-2">
          <AmbassadorSalaryMyStatus />

          <div className="flex flex-wrap items-center justify-end gap-x-4">
            <FellowshipSalaryStatsActiveCycleDetailLink />
            <AmbassadorSalaryRegister />
            <AmbassadorSalaryPayout />
          </div>
        </div>
      </SecondaryCard>
    </div>
  );
}
