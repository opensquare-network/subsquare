import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import useFellowshipSalaryPeriods from "next-common/hooks/fellowship/salary/useFellowshipSalaryPeriods";
import { useCalcPeriodBlocks } from "next-common/hooks/useCalcPeriodBlocks";
import SummaryItem from "next-common/components/summary/layout/item";
import RemainLabel from "next-common/components/fellowship/salary/cycles/summary/remainLabel";

export default function SalaryStatsTimeRemainItem() {
  const stats = useSelector(fellowshipSalaryStatusSelector);
  const { cycleStart } = stats || {};

  const { registrationPeriod, payoutPeriod } = useFellowshipSalaryPeriods();
  const registrationPeriodData = useCalcPeriodBlocks(
    registrationPeriod,
    cycleStart,
  );
  const payoutStart = cycleStart + registrationPeriod || null;
  const payoutPeriodData = useCalcPeriodBlocks(payoutPeriod, payoutStart);

  return (
    <SummaryItem title="Total Unregistered Paid">
      <div className="space-y-1">
        <RemainLabel
          percentage={registrationPeriodData.gonePercentage}
          label={"Registration"}
          remain={registrationPeriodData.remainBlocks}
          time={registrationPeriod}
        />
        <RemainLabel
          percentage={payoutPeriodData.gonePercentage}
          label={"Payout"}
          remain={payoutPeriodData.remainBlocks}
          time={payoutPeriodData.totalPeriodTime.split(" ")}
        />
      </div>
    </SummaryItem>
  );
}
