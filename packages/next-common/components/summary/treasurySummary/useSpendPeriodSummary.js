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

function useLastSpendPeriod(api) {
  const pallet = useTreasuryPallet();
  const [lastSpendPeriod, setLastSpendPeriod] = useState(null);

  useEffect(() => {
    if (!api || !api.query || !api.query[pallet]?.lastSpendPeriod) {
      return;
    }

    api.query[pallet].lastSpendPeriod().then((result) => {
      setLastSpendPeriod(result?.toString() || null);
    });
  }, [api, pallet]);

  return lastSpendPeriod;
}

export default function useSpendPeriodSummary() {
  const api = useConditionalContextApi();
  const blockHeight = useAhmLatestHeight();
  const [summary, setSummary] = useState({});
  const isMounted = useMountedState();
  const blockTime = useSelector(blockTimeSelector);
  const lastSpendPeriod = useLastSpendPeriod(api);
  const spendPeriod = useSpendPeriod(api);

  useEffect(() => {
    if (!api) {
      return;
    }

    let goneBlocks;
    if (lastSpendPeriod) {
      goneBlocks = new BigNumber(blockHeight).minus(lastSpendPeriod).toNumber();
    } else {
      goneBlocks = new BigNumber(blockHeight).mod(spendPeriod).toNumber();
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
  }, [api, blockHeight, blockTime, isMounted, lastSpendPeriod, spendPeriod]);

  return summary;
}
