import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipSalaryStats from "next-common/components/overview/fellowship/salary/stats";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import FellowshipSalaryStatsDetailLink from "next-common/components/overview/fellowship/salary/detailLink";

export default function FellowshipSalaryActiveCycle() {
  return (
    <>
      <TitleContainer className="mb-4">Current Cycle</TitleContainer>

      <SecondaryCard>
        <FellowshipSalaryStats />

        <div className="mt-2 flex justify-end">
          <FellowshipSalaryStatsDetailLink />
        </div>
      </SecondaryCard>
    </>
  );
}
