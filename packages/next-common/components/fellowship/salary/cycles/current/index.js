import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipSalaryStats from "next-common/components/overview/fellowship/salary/stats";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import FellowshipSalaryStatsDetailLink from "next-common/components/overview/fellowship/salary/detailLink";
import FellowshipSalaryRegister from "next-common/components/fellowship/salary/actions/register";

export default function FellowshipSalaryActiveCycle() {
  return (
    <>
      <TitleContainer className="mb-4">Current Cycle</TitleContainer>

      <SecondaryCard>
        <FellowshipSalaryStats />

        <hr className="my-4" />

        <div className="space-y-2">
          <div className="flex items-center justify-end gap-4">
            <FellowshipSalaryStatsDetailLink />
            <FellowshipSalaryRegister />
          </div>
        </div>
      </SecondaryCard>
    </>
  );
}
