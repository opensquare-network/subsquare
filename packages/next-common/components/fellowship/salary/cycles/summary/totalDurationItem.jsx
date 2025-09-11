import LoadableContent from "next-common/components/common/loadableContent";
import { chunk, isNil } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import SummaryItem from "next-common/components/summary/layout/item";
import { useCalcPeriodBlocks } from "next-common/hooks/useCalcPeriodBlocks";

export default function SalaryStatsTotalDurationSummaryItem({
  cycleData = {},
}) {
  const { registrationPeriod, payoutPeriod } = cycleData;

  const { cycleStart } = cycleData.status;

  const totalCyclePeriod = registrationPeriod + payoutPeriod || null;
  const cycleStartAt = cycleStart || null;

  const cyclePeriodData = useCalcPeriodBlocks(totalCyclePeriod, cycleStartAt);
  const [totalPeriodDay] = chunk(cyclePeriodData.totalPeriodTime.split(" "), 2);

  return (
    <SummaryItem title="Total Duration">
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
