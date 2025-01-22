import useSalaryFellowshipPeriods from "next-common/hooks/fellowship/salary/useSalaryFellowshipPeriods";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import { chunk, isNil } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { useCalcPeriodBlocks } from "next-common/hooks/useCalcPeriodBlocks";
import FellowshipTotalPeriodCountdown from "next-common/components/fellowship/salary/cycles/summary/totalPeriodCountdown";

export default function SalaryStatsTotalPeriodItem({ cycleStart }) {
  const { registrationPeriod, payoutPeriod } = useSalaryFellowshipPeriods();
  const totalCyclePeriod = registrationPeriod + payoutPeriod || null;
  const cyclePeriodData = useCalcPeriodBlocks(totalCyclePeriod, cycleStart);
  const [totalPeriodDay] = chunk(cyclePeriodData.totalPeriodTime.split(" "), 2);

  const suffix = isNil(totalCyclePeriod) ? null : (
    <FellowshipTotalPeriodCountdown
      className="absolute top-0 right-0"
      percentage={cyclePeriodData.gonePercentage}
      totalRemain={cyclePeriodData.remainBlocks}
    />
  );

  return (
    <SummaryItem title="Total Period" className="relative" suffix={suffix}>
      <LoadableContent isLoading={isNil(totalCyclePeriod)}>
        <Tooltip
          content={<span>{totalCyclePeriod?.toLocaleString?.()} blocks</span>}
        >
          <div>
            {totalPeriodDay[0]}{" "}
            <span className="text-textTertiary">{totalPeriodDay[1]}</span>
          </div>
        </Tooltip>
      </LoadableContent>
    </SummaryItem>
  );
}
