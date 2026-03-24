import { useMemo } from "react";
import { usePageProps } from "next-common/context/page";
import {
  useSpendPeriodWithPapi,
  useLastSpendPeriodWithPapi,
} from "next-common/components/summary/treasurySummary/useSpendPeriodSummaryWithPapi";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import useTreasuryBurnWithPapi from "next-common/utils/hooks/useTreasuryBurnWithPapi";
import useTreasuryFreeWithPapi from "next-common/utils/hooks/useTreasuryFreeWithPapi";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useContextPapiApi } from "next-common/context/papi";

export default function useNextBurnData() {
  const { symbol, decimals } = useChainSettings();
  const papi = useContextPapiApi();
  const { free, isLoading: isFreeLoading } = useTreasuryFreeWithPapi(papi);
  const nextBurnAmount = useTreasuryBurnWithPapi(papi, free || 0);
  const { burnChart } = usePageProps();
  const spendPeriod = useSpendPeriodWithPapi(papi);
  const lastBurnBlockHeight = useLastSpendPeriodWithPapi(papi);
  const blockTime = useSelector(blockTimeSelector);
  const lastBurnTime = burnChart?.result?.[0]?.timestamp;

  const isLoading = !papi || isFreeLoading || !spendPeriod || !blockTime;

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
