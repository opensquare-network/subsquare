import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import BigNumber from "bignumber.js";
import { estimateBlocksTime } from "next-common/utils";
import { useTreasuryPallet } from "next-common/context/treasury";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

function useSpendPeriod(api) {
  const pallet = useTreasuryPallet();
  const [spendPeriod, setSpendPeriod] = useState(null);

  useEffect(() => {
    if (!api || !api.consts || !api.consts[pallet]?.spendPeriod) {
      return;
    }

    setSpendPeriod(api.consts[pallet].spendPeriod.toNumber());
  }, [api, pallet]);

  return spendPeriod;
}

function useAhmStartHeight(api) {
  const pallet = useTreasuryPallet();
  const [startHeight, setStartHeight] = useState(null);

  useEffect(() => {
    if (!api || !api.query || !api.query[pallet]?.lastSpendPeriod) {
      return;
    }

    api.query[pallet].lastSpendPeriod().then((result) => {
      setStartHeight(result?.toString() || null);
    });
  }, [api, pallet]);

  return startHeight;
}

export default function useSpendPeriodSummary() {
  const api = useConditionalContextApi();
  const latestHeight = useAhmLatestHeight();
  const [summary, setSummary] = useState({});
  const isMounted = useMountedState();
  const blockTime = useSelector(blockTimeSelector);
  const startHeight = useAhmStartHeight(api);
  const spendPeriod = useSpendPeriod(api);

  useEffect(() => {
    if (!api) {
      return;
    }

    let goneBlocks;
    if (startHeight) {
      goneBlocks = new BigNumber(latestHeight).minus(startHeight).toNumber();
    } else {
      goneBlocks = new BigNumber(latestHeight).mod(spendPeriod).toNumber();
    }

    const progress = new BigNumber(goneBlocks)
      .div(spendPeriod)
      .multipliedBy(100)
      .toNumber();

    if (!spendPeriod || !goneBlocks || !blockTime) {
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
  }, [api, latestHeight, blockTime, isMounted, startHeight, spendPeriod]);

  return summary;
}
