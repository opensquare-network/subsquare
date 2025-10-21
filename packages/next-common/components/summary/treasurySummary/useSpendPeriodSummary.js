import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useEffect, useState, useCallback } from "react";
import { useMountedState } from "react-use";
import BigNumber from "bignumber.js";
import { estimateBlocksTime } from "next-common/utils";
import useChainOrScanHeight from "next-common/hooks/height";
import { useTreasuryPallet } from "next-common/context/treasury";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

function useConditionalBlockHeight(api) {
  const localHeight = useChainOrScanHeight();
  const ahmLatestHeight = useAhmLatestHeight();
  const pallet = useTreasuryPallet();
  const [blockHeight, setBlockHeight] = useState(null);

  const getBlockHeight = useCallback(async () => {
    if (!api || !pallet) {
      return;
    }
    const lastSpendPeriod = await api?.query[pallet]?.lastSpendPeriod();
    if (lastSpendPeriod && !lastSpendPeriod?.isNone) {
      setBlockHeight(ahmLatestHeight);
      return;
    }

    setBlockHeight(localHeight);
  }, [api, pallet, ahmLatestHeight, localHeight]);

  useEffect(() => {
    getBlockHeight();
  }, [getBlockHeight]);

  return blockHeight;
}

export default function useSpendPeriodSummary() {
  const api = useConditionalContextApi();
  const blockHeight = useConditionalBlockHeight(api);
  const [summary, setSummary] = useState({});
  const isMounted = useMountedState();
  const blockTime = useSelector(blockTimeSelector);
  const pallet = useTreasuryPallet();

  useEffect(() => {
    if (
      !api ||
      !api.consts ||
      !api.consts[pallet]?.spendPeriod ||
      !blockHeight
    ) {
      return;
    }

    const spendPeriod = api.consts[pallet].spendPeriod.toNumber();
    const goneBlocks = new BigNumber(blockHeight).mod(spendPeriod).toNumber();
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
  }, [api, blockHeight, blockTime, isMounted, pallet]);

  return summary;
}
