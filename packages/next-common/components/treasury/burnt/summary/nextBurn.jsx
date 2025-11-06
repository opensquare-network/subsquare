import { useMemo } from "react";
import dayjs from "dayjs";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import SummaryItem from "next-common/components/summary/layout/item";
import useNextBurnData from "./useNextBurnData";

export default function NextBurnSummary() {
  const { symbol, nextBurnAmount, nextBurnBlockHeight, nextBurnTime } =
    useNextBurnData();

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
        <ValueDisplay value={nextBurnAmount} symbol={symbol} />
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
