import useSubFellowshipSalaryStats from "next-common/hooks/fellowship/salary/useSubFellowshipSalaryStats";
import useFellowshipSalaryPeriods from "next-common/hooks/fellowship/salary/useFellowshipSalaryPeriods";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

export default function FellowshipSalaryStats() {
  const stats = useSubFellowshipSalaryStats();
  const { registrationPeriod, payoutPeriod } = useFellowshipSalaryPeriods();
  console.log(
    "stats",
    stats,
    "registrationPeriod",
    registrationPeriod,
    "payoutPeriod",
    payoutPeriod,
  );

  return (
    <div>
      <TitleContainer className="mb-4">Fellowship Salary Stats</TitleContainer>
      <SecondaryCard>{/* todo: implement salary stats card */}</SecondaryCard>
    </div>
  );
}
