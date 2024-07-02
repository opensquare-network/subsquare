import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import useFellowshipSalaryPeriods from "next-common/hooks/fellowship/salary/useFellowshipSalaryPeriods";
import { useCalcPeriodBlocks } from "next-common/hooks/useCalcPeriodBlocks";
import SummaryItem from "next-common/components/summary/layout/item";
import RemainLabel from "next-common/components/fellowship/salary/cycles/summary/remainLabel";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";
import { useCollectivesContext } from "next-common/context/collectives/collectives";

export default function SalaryStatsTimeRemainItem() {
  const { section } = useCollectivesContext();
  const statusSelector =
    section === "fellowship"
      ? fellowshipSalaryStatusSelector
      : ambassadorSalaryStatusSelector;

  const stats = useSelector(statusSelector);
  const { cycleStart } = stats || {};

  const { registrationPeriod, payoutPeriod } = useFellowshipSalaryPeriods();
  const registrationPeriodData = useCalcPeriodBlocks(
    registrationPeriod,
    cycleStart,
  );
  const payoutStart = cycleStart + registrationPeriod || null;
  const payoutPeriodData = useCalcPeriodBlocks(payoutPeriod, payoutStart);

  return (
    <SummaryItem>
      <div className="space-y-1">
        <RemainLabel
          percentage={registrationPeriodData.gonePercentage}
          label={"Registration"}
          remain={registrationPeriodData.remainBlocks}
          time={registrationPeriodData.totalPeriodTime.split(" ")}
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
