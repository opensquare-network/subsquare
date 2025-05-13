import { isNil } from "lodash-es";
import useChainOrScanHeight from "next-common/hooks/height";
import { toPercentage } from "next-common/utils";
import { useEstimateBlocksTime } from "next-common/utils/hooks";

export function useCalcPeriodBlocks(period, startAt) {
  const latestHeight = useChainOrScanHeight();

  const endAt = startAt + period || null;
  const isStarted =
    !isNil(latestHeight) && !isNil(startAt) && latestHeight >= startAt;
  const gone = latestHeight - startAt;
  const totalPeriodTime = useEstimateBlocksTime(period);

  const remainBlocks = Math.max(0, endAt - latestHeight);
  const gonePercentage = isStarted
    ? Math.min(100, toPercentage(gone / period, 2))
    : 0;

  return {
    remainBlocks,
    gonePercentage,
    totalPeriodTime,
  };
}
