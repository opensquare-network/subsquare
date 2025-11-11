import { useMemo } from "react";
import dayjs from "dayjs";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import useNextBurnData from "./useNextBurnData";

export default function NextBurnSummary() {
  const {
    symbol,
    nextBurnAmount,
    nextBurnBlockHeight,
    nextBurnTime,
    isLoading,
  } = useNextBurnData();

  const tooltipContent = useMemo(() => {
    if (!nextBurnTime) {
      return null;
    }

    return (
      <div className="space-y-1">
        {nextBurnBlockHeight && (
          <div>#{nextBurnBlockHeight?.toLocaleString()}</div>
        )}
        <div>Next Burn Time: {dayjs(nextBurnTime).format("YYYY-MM-DD")}</div>
      </div>
    );
  }, [nextBurnTime, nextBurnBlockHeight]);

  return (
    <SummaryItem title="Next Burn">
      <div className="flex flex-col gap-[4px]">
        <LoadableContent isLoading={isLoading}>
          <ValueDisplay value={nextBurnAmount} symbol={symbol} />
        </LoadableContent>
        {nextBurnTime && (
          <Tooltip content={tooltipContent}>
            <div className="text12Medium text-textTertiary">
              {dayjs(nextBurnTime).format("YYYY-MM-DD")}
            </div>
          </Tooltip>
        )}
      </div>
    </SummaryItem>
  );
}
