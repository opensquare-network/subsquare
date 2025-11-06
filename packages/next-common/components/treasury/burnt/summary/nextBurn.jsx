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
import { usePageProps } from "next-common/context/page";
import {
  useSpendPeriod,
  useLastSpendPeriod,
} from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";

export default function NextBurnSummary() {
  const { symbol, decimals } = useChainSettings();
  const api = useConditionalContextApi();
  const { free } = useTreasuryFree(api);
  const nextBurn = useTreasuryBurn(api, free || 0);
  const { burntChart } = usePageProps();
  const spendPeriod = useSpendPeriod(api);
  const lastBurnBlockHeight = useLastSpendPeriod(api);
  const blockTime = useSelector(blockTimeSelector);
  const lastBurnTime = burntChart?.result?.[0]?.timestamp;

  const nextBurnBlockHeight = useMemo(() => {
    if (!lastBurnBlockHeight || !spendPeriod) {
      return null;
    }
    return Number(lastBurnBlockHeight) + spendPeriod;
  }, [lastBurnBlockHeight, spendPeriod]);

  const nextBurnTime = useMemo(() => {
    if (!lastBurnTime || !blockTime || !spendPeriod) {
      return null;
    }
    return new Date(lastBurnTime).getTime() + spendPeriod * blockTime;
  }, [lastBurnTime, blockTime, spendPeriod]);

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
