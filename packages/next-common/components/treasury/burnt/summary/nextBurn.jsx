import { useMemo } from "react";
import dayjs from "dayjs";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import SummaryItem from "next-common/components/summary/layout/item";
import useTreasuryBurn from "next-common/utils/hooks/useTreasuryBurn";
import useTreasuryFree from "next-common/utils/hooks/useTreasuryFree";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import useSpendPeriodSummary from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";

export default function NextBurnSummary() {
  const { symbol, decimals } = useChainSettings();
  const api = useConditionalContextApi();
  const { free } = useTreasuryFree(api);
  const nextBurn = useTreasuryBurn(api, free || 0);
  const summary = useSpendPeriodSummary();

  // console.log("::::summary", summary);

  const nextBurnTime = useMemo(() => {
    if (!summary?.spendPeriod) {
      return null;
    }

    const spendPeriodArray = summary.spendPeriod;
    let totalMs = 0;

    for (let i = 0; i < spendPeriodArray.length; i += 2) {
      const value = parseInt(spendPeriodArray[i], 10);
      const unit = spendPeriodArray[i + 1];

      if (unit === "days" || unit === "day") {
        totalMs += value * 24 * 60 * 60 * 1000;
      } else if (unit === "hrs" || unit === "hr") {
        totalMs += value * 60 * 60 * 1000;
      } else if (unit === "mins" || unit === "min") {
        totalMs += value * 60 * 1000;
      } else if (unit === "secs" || unit === "sec") {
        totalMs += value * 1000;
      }
    }

    return Date.now() + totalMs;
  }, [summary]);

  const tooltipContent = useMemo(() => {
    if (!nextBurnTime) {
      return null;
    }

    return (
      <div className="space-y-1">
        <div>
          Next Burn Time: {dayjs(nextBurnTime).format("YYYY-MM-DD HH:mm:ss")}
        </div>
      </div>
    );
  }, [nextBurnTime]);

  return (
    <SummaryItem title="Next Burn">
      <div className="flex flex-col gap-[4px]">
        <ValueDisplay value={toPrecision(nextBurn, decimals)} symbol={symbol} />
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
