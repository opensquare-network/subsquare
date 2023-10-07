import useApi from "next-common/utils/hooks/useApi";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import BigNumber from "bignumber.js";
import { estimateBlocksTime } from "next-common/utils";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export default function useSpendPeriodSummary() {
  const api = useApi();
  const blockHeight = useSelector(chainOrScanHeightSelector);
  const [summary, setSummary] = useState({});
  const isMounted = useIsMounted();
  const blockTime = useSelector(blockTimeSelector);

  useEffect(() => {
    if (api?.consts?.treasury?.spendPeriod && blockHeight) {
      const spendPeriod = api.consts.treasury.spendPeriod.toNumber();
      const goneBlocks = new BigNumber(blockHeight).mod(spendPeriod).toNumber();
      const progress = new BigNumber(goneBlocks)
        .div(spendPeriod)
        .multipliedBy(100)
        .toNumber();
      const timeArray = estimateBlocksTime(spendPeriod - goneBlocks, blockTime);
      if (isMounted.current) {
        setSummary({
          progress,
          spendPeriod: timeArray,
          totalPeriod: ["/"].concat(estimateBlocksTime(spendPeriod, blockTime)),
        });
      }
    }
  }, [api, blockHeight, blockTime]);

  return summary;
}
