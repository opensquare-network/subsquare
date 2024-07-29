import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import useSalaryFellowshipPeriods from "next-common/hooks/fellowship/salary/useSalaryFellowshipPeriods";
import { useCalcPeriodBlocks } from "next-common/hooks/useCalcPeriodBlocks";
import SummaryItem from "next-common/components/summary/layout/item";
import RemainLabel from "next-common/components/fellowship/salary/cycles/summary/remainLabel";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";
import { useCollectivesContext } from "next-common/context/collectives/collectives";

export default function SalaryStatsTimeRemainItem() {
  const { section } = useCollectivesContext();
  let statusSelector = null;
  if (section === "fellowship") {
    statusSelector = fellowshipSalaryStatusSelector;
  } else if (section === "ambassador") {
    statusSelector = ambassadorSalaryStatusSelector;
  }

  const stats = useSelector(statusSelector);
  const { cycleStart } = stats || {};

  const { registrationPeriod, payoutPeriod } = useSalaryFellowshipPeriods();
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
