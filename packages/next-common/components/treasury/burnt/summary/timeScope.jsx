import { useMemo } from "react";
import dayjs from "dayjs";
import Tooltip from "next-common/components/tooltip";
import SummaryItem from "next-common/components/summary/layout/item";
import { usePageProps } from "next-common/context/page";

export default function TimeScopeSummary() {
  const { burntChart, burntList } = usePageProps();

  const chartData = burntChart?.result || [];
  const earliestChartItem = chartData[chartData.length - 1];
  const latestChartItem = chartData[0];

  const listItems = burntList?.items || [];
  const latestListItem = listItems[0];
  const earliestListItem = listItems[listItems.length - 1];

  const startBlockTime = earliestChartItem?.timestamp;
  const endBlockTime = latestChartItem?.timestamp;

  const startBlockHeight = earliestListItem?.indexer?.blockHeight;
  const endBlockHeight = latestListItem?.indexer?.blockHeight;

  const valueText = useMemo(() => {
    if (!startBlockTime && !endBlockTime) {
      return "-";
    }
    const startStr = startBlockTime
      ? dayjs(startBlockTime).format("YYYY-MM-DD")
      : "-";
    const endStr = endBlockTime
      ? dayjs(endBlockTime).format("YYYY-MM-DD")
      : "-";
    return `${startStr} ~ ${endStr}`;
  }, [startBlockTime, endBlockTime]);

  const tooltipContent = useMemo(() => {
    return (
      <div className="space-y-1">
        <div>
          {startBlockHeight && endBlockHeight ? (
            <>
              #{startBlockHeight?.toLocaleString()} - #
              {endBlockHeight?.toLocaleString()}
            </>
          ) : (
            "-"
          )}
        </div>
        <div>
          Start Time:{" "}
          {startBlockTime
            ? dayjs(startBlockTime).format("YYYY-MM-DD HH:mm:ss")
            : "-"}
        </div>
        <div>
          End Time:{" "}
          {endBlockTime
            ? dayjs(endBlockTime).format("YYYY-MM-DD HH:mm:ss")
            : "-"}
        </div>
      </div>
    );
  }, [startBlockTime, startBlockHeight, endBlockTime, endBlockHeight]);

  return (
    <SummaryItem title="Time Scope">
      <Tooltip content={tooltipContent}>
        <span className="text14Medium text-textPrimary">{valueText}</span>
      </Tooltip>
    </SummaryItem>
  );
}
