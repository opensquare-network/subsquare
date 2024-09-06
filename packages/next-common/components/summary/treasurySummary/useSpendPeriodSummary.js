import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import BigNumber from "bignumber.js";
import { estimateBlocksTime } from "next-common/utils";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useContextApi } from "next-common/context/api";
import { useTreasuryPallet } from "next-common/context/treasury";

export default function useSpendPeriodSummary() {
  const api = useContextApi();
  const blockHeight = useSelector(chainOrScanHeightSelector);
  const [summary, setSummary] = useState({});
  const isMounted = useMountedState();
  const blockTime = useSelector(blockTimeSelector);
  const pallet = useTreasuryPallet();

  useEffect(() => {
    if (!api || !api.consts || !api.consts[pallet]?.spendPeriod) {
      return;
    }

    const spendPeriod = api.consts[pallet].spendPeriod.toNumber();
    const goneBlocks = new BigNumber(blockHeight).mod(spendPeriod).toNumber();
    const progress = new BigNumber(goneBlocks)
      .div(spendPeriod)
      .multipliedBy(100)
      .toNumber();
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
  }, [api, blockHeight, blockTime]);

  return summary;
}
