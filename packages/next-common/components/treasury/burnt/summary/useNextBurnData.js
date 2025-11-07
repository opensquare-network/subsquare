import { useMemo } from "react";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import { usePageProps } from "next-common/context/page";
import {
  useSpendPeriod,
  useLastSpendPeriod,
} from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import useTreasuryBurn from "next-common/utils/hooks/useTreasuryBurn";
import useTreasuryFree from "next-common/utils/hooks/useTreasuryFree";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

export default function useNextBurnData() {
  const { symbol, decimals } = useChainSettings();
  const api = useConditionalContextApi();
  const { free, isLoading: isFreeLoading } = useTreasuryFree(api);
  const nextBurnAmount = useTreasuryBurn(api, free || 0);
  const { burntChart } = usePageProps();
  const spendPeriod = useSpendPeriod(api);
  const lastBurnBlockHeight = useLastSpendPeriod(api);
  const blockTime = useSelector(blockTimeSelector);
  const lastBurnTime = burntChart?.result?.[0]?.timestamp;

  const isLoading = !api || isFreeLoading || !spendPeriod || !blockTime;

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

  return {
    symbol,
    decimals,
    nextBurnAmount: toPrecision(nextBurnAmount, decimals),
    nextBurnBlockHeight,
    nextBurnTime,
    isLoading,
  };
}
