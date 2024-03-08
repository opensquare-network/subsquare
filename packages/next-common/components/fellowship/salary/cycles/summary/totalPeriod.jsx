import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";
import FellowshipTotalPeriodCountdown from "./totalPeriodCountdown";
import Tooltip from "next-common/components/tooltip";

export default function getCycleTotalPeriodSummaryItem(
  totalCyclePeriod,
  totalPeriodDay,
  totalPercentage,
  totalRemain,
) {
  return {
    title: "Total Period",
    className: "relative",
    content: (
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
    ),
    suffix: (
      <FellowshipTotalPeriodCountdown
        className="absolute top-0 right-0"
        percentage={totalPercentage}
        totalRemain={totalRemain}
      />
    ),
  };
}
