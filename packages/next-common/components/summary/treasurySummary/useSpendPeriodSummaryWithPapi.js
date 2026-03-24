import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import BigNumber from "bignumber.js";
import { estimateBlocksTime } from "next-common/utils";
import { useTreasuryPapiPallet } from "next-common/context/treasury";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import { useContextPapiApi } from "next-common/context/papi";

export function useSpendPeriodWithPapi(papi) {
  const pallet = useTreasuryPapiPallet();
  const [spendPeriod, setSpendPeriod] = useState(null);

  useEffect(() => {
    if (!papi || !papi?.constants?.[pallet]?.SpendPeriod) {
      return;
    }

    papi.constants[pallet].SpendPeriod().then((result) => {
      setSpendPeriod(result);
    });
  }, [papi, pallet]);

  return spendPeriod;
}

export function useLastSpendPeriodWithPapi(papi) {
  const pallet = useTreasuryPapiPallet();
  const [lastSpendPeriod, setLastSpendPeriod] = useState(null);

  useEffect(() => {
    if (!papi || !papi?.query?.[pallet]?.LastSpendPeriod?.getValue) {
      return;
    }

    papi.query[pallet].LastSpendPeriod.getValue().then((result) => {
      setLastSpendPeriod(result?.toString() || null);
    });
  }, [papi, pallet]);

  return lastSpendPeriod;
}

export default function useSpendPeriodSummaryWithPapi() {
  const papi = useContextPapiApi();
  const latestHeight = useAhmLatestHeight();
  const [summary, setSummary] = useState({});
  const isMounted = useMountedState();
  const blockTime = useSelector(blockTimeSelector);
  const lastSpendPeriod = useLastSpendPeriodWithPapi(papi);
  const spendPeriod = useSpendPeriodWithPapi(papi);

  useEffect(() => {
    if (!papi || !spendPeriod || !blockTime) {
      return;
    }

    let goneBlocks;
    if (lastSpendPeriod) {
      goneBlocks = new BigNumber(latestHeight)
        .minus(lastSpendPeriod)
        .toNumber();
    } else {
      goneBlocks = new BigNumber(latestHeight).mod(spendPeriod).toNumber();
    }

    const progress = new BigNumber(goneBlocks)
      .div(spendPeriod)
      .multipliedBy(100)
      .toNumber();

    if (!goneBlocks) {
      return;
    }

    const spendPeriodTime = estimateBlocksTime(
      spendPeriod - goneBlocks,
      blockTime,
    ).split(" ");

    if (isMounted()) {
      setSummary({
        progress,
        spendPeriod: spendPeriodTime,
        totalPeriod: ["/"].concat(
          estimateBlocksTime(spendPeriod, blockTime).split(" "),
        ),
      });
    }
  }, [papi, latestHeight, blockTime, isMounted, lastSpendPeriod, spendPeriod]);

  return summary;
}
