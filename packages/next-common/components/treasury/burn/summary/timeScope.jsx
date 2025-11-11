import { useMemo } from "react";
import dayjs from "dayjs";
import Tooltip from "next-common/components/tooltip";
import SummaryItem from "next-common/components/summary/layout/item";
import useTimeScopeData from "./useTimeScopeData";

export default function TimeScopeSummary() {
  const {
    startBlockTime,
    endBlockTime,
    startBlockHeight,
    endBlockHeight,
    valueText,
  } = useTimeScopeData();

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
