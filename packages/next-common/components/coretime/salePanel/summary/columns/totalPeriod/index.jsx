import { useMemo, memo } from "react";
import SummaryItem from "next-common/components/summary/layout/item";
import { SummaryColumnGap } from "../../common";
import TotalPeriodCountdown from "./countdown";
import FieldLoading from "next-common/components/icons/fieldLoading";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { getCountDownProgress } from "../currentPhase/common";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useRemainingTime } from "next-common/components/remaining";
import EndAt from "./endAt";
import PassedTime from "./passedTime";
import TotalTime from "./totalTime";
import { usePageProps } from "next-common/context/page";
import useCoretimeSaleEnd from "next-common/context/coretime/hooks/useCoretimeSaleEnd";

function getEndBlocksTime(initBlocksTime, blockTime, blockGap) {
  return initBlocksTime + blockGap * blockTime;
}

function SalePeriodContent({
  passedBlockGap,
  remaining,
  totalBlockGap,
  endBlocksTime,
}) {
  return (
    <div className="space-y-1">
      <PassedTime passedBlockGap={passedBlockGap} remaining={remaining} />
      <TotalTime totalBlockGap={totalBlockGap} />
      <EndAt endTime={endBlocksTime} />
    </div>
  );
}

const MemoizedSalePeriodContent = memo(SalePeriodContent);

export default function TotalPeriod() {
  const { coretimeSale } = usePageProps();
  const { initIndexer = {} } = coretimeSale;
  const initHeight = initIndexer?.blockHeight;
  const { isLoading, indexer: endIndexer } = useCoretimeSaleEnd();

  const chainHeight = useSelector(chainOrScanHeightSelector);
  const blockTime = useSelector(blockTimeSelector);

  const endHeight = endIndexer?.blockHeight;

  const totalBlockGap = useMemo(
    () => endHeight - initHeight,
    [endHeight, initHeight],
  );
  const passedBlockGap = useMemo(
    () => chainHeight - initHeight,
    [chainHeight, initHeight],
  );
  const remainingBlocksGap = useMemo(
    () => endHeight - chainHeight,
    [endHeight, chainHeight],
  );

  const remaining = useRemainingTime(remainingBlocksGap);
  const percentage = useMemo(
    () => getCountDownProgress(initHeight, chainHeight, endHeight),
    [initHeight, chainHeight, endHeight],
  );

  const endBlocksTime = useMemo(
    () => getEndBlocksTime(initIndexer?.blockTime, blockTime, totalBlockGap),
    [initIndexer, blockTime, totalBlockGap],
  );

  const isFieldLoading = !initHeight || !endHeight || isLoading;

  return (
    <SummaryColumnGap>
      <SummaryItem
        title="Total Period"
        suffix={<TotalPeriodCountdown percentage={percentage} />}
      >
        {isFieldLoading ? (
          <FieldLoading />
        ) : (
          <MemoizedSalePeriodContent
            passedBlockGap={passedBlockGap}
            remaining={remaining}
            totalBlockGap={totalBlockGap}
            endBlocksTime={endBlocksTime}
          />
        )}
      </SummaryItem>
    </SummaryColumnGap>
  );
}
