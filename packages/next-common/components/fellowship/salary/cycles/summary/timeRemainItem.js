import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import useSalaryFellowshipPeriods from "next-common/hooks/fellowship/salary/useSalaryFellowshipPeriods";
import { useCalcPeriodBlocks } from "next-common/hooks/useCalcPeriodBlocks";
import SummaryItem from "next-common/components/summary/layout/item";
import RemainLabel from "next-common/components/fellowship/salary/cycles/summary/remainLabel";

export default function SalaryStatsTimeRemainItem() {
  const stats = useFellowshipSalaryStats();
  const { cycleStart } = stats || {};

  const { registrationPeriod, payoutPeriod } = useSalaryFellowshipPeriods();
  const registrationPeriodData = useCalcPeriodBlocks(
    registrationPeriod,
    cycleStart,
  );
  const payoutStart = cycleStart + registrationPeriod || null;
  const payoutPeriodData = useCalcPeriodBlocks(payoutPeriod, payoutStart);

  if (!stats) {
    return null;
  }

  return (
    <SummaryItem>
      <div className="space-y-1">
        <RemainLabel
          percentage={registrationPeriodData.gonePercentage}
          label={"Registration"}
          total={registrationPeriod}
          remain={registrationPeriodData.remainBlocks}
          text={registrationPeriodData.totalPeriodTime}
        />
        <RemainLabel
          percentage={payoutPeriodData.gonePercentage}
          label={"Payout"}
          total={payoutPeriod}
          remain={payoutPeriodData.remainBlocks}
          text={payoutPeriodData.totalPeriodTime}
        />
      </div>
    </SummaryItem>
  );
}
