import LoadableContent from "next-common/components/common/loadableContent";
import isNil from "lodash.isnil";
import Tooltip from "next-common/components/tooltip";

export default function getCycleTotalDurationSummaryItem(
  totalCyclePeriod,
  totalPeriodDay,
) {
  return {
    title: "Total Duration",
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
  };
}
