import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipSalaryStats from "next-common/components/overview/fellowship/salary/stats";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import FellowshipSalaryStatsDetailLink from "next-common/components/overview/fellowship/salary/detailLink";
import FellowshipSalaryRegister from "next-common/components/fellowship/salary/actions/register";
import Divider from "next-common/components/styled/layout/divider";

export default function FellowshipSalaryActiveCycle() {
  return (
    <>
      <TitleContainer className="mb-4">Current Cycle</TitleContainer>

      <SecondaryCard>
        <FellowshipSalaryStats />
        <Divider className="mt-4" />
        <div className="mt-4 flex items-center justify-end gap-4">
          <FellowshipSalaryStatsDetailLink />
          <FellowshipSalaryRegister />
        </div>
      </SecondaryCard>
    </>
  );
}
