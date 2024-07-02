import AmbassadorSalaryStatsActiveCycleDetailLink from "next-common/components/overview/ambassador/salary/detailLink/activeCycle";
import { isNil } from "lodash-es";
import AmbassadorSalaryStats from "next-common/components/overview/ambassador/salary/stats";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";
import { useSelector } from "react-redux";
import AmbassadorSalaryRegister from "../../actions/register";
import AmbassadorSalaryPayout from "../../actions/payout";

export default function AmbassadorSalaryCurrentCycle() {
  const stats = useSelector(ambassadorSalaryStatusSelector);

  if (isNil(stats)) {
    // return null;
  }

  return (
    <div>
      <TitleContainer className="mb-4">Current Cycle</TitleContainer>

      <SecondaryCard>
        <AmbassadorSalaryStats />

        <hr className="my-4" />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-end gap-x-4">
            <AmbassadorSalaryStatsActiveCycleDetailLink />
            <AmbassadorSalaryRegister />
            <AmbassadorSalaryPayout />
          </div>
        </div>
      </SecondaryCard>
    </div>
  );
}
