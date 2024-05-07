import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipSalaryStats from "next-common/components/overview/fellowship/salary/stats";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import FellowshipSalaryStatsActiveCycleDetailLink from "next-common/components/overview/fellowship/salary/detailLink/activeCycle";
import FellowshipSalaryRegister from "next-common/components/fellowship/salary/actions/register";
import FellowshipSalaryPayout from "next-common/components/fellowship/salary/actions/payout";
import FellowshipSalaryBump from "next-common/components/fellowship/salary/actions/bump";
import FellowshipSalaryMyStatus from "../myStatus";

export default function FellowshipSalaryActiveCycle() {
  return (
    <>
      <TitleContainer className="mb-4">Current Cycle</TitleContainer>

      <SecondaryCard>
        <FellowshipSalaryStats />

        <hr className="my-4" />

        <div className="space-y-2">
          <FellowshipSalaryMyStatus />

          <div className="flex items-center justify-end gap-4">
            <FellowshipSalaryStatsActiveCycleDetailLink />
            <FellowshipSalaryRegister />
            <FellowshipSalaryPayout />
            <FellowshipSalaryBump />
          </div>
        </div>
      </SecondaryCard>
    </>
  );
}
