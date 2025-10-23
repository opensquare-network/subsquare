import { useMemo, memo } from "react";
import SummaryItem from "next-common/components/summary/layout/item";
import { SummaryColumnGap } from "../../common";
import TotalPeriodCountdown from "./countdown";
import FieldLoading from "next-common/components/icons/fieldLoading";
import useAlwaysRelayHeight from "next-common/hooks/useAlwaysRelayHeight";
import { getCountDownProgress } from "../currentPhase/common";
import StartAt from "./startAt";
import EndAt from "./endAt";
import PassedTime from "./passedTime";
import TotalTime from "./totalTime";
import useCoretimeSaleEnd from "next-common/context/coretime/hooks/useCoretimeSaleEnd";
import { estimateBlocksTime } from "next-common/utils";
import useBlockTime from "next-common/context/coretime/hooks/useBlockTime";
import { useCoretimeSaleInitIndexer } from "next-common/context/coretime/sale/provider";

export function getEndBlocksTime(initBlocksTime, blockTime, blockGap) {
  return initBlocksTime + blockGap * blockTime;
}

function SalePeriodContent({
  passedBlockGap,
  remaining,
  totalBlockGap,
  initIndexer,
  endIndexer,
}) {
  return (
    <div className="flex flex-col gap-y-1">
      <PassedTime passedBlockGap={passedBlockGap} remaining={remaining} />
      <TotalTime totalBlockGap={totalBlockGap} />
      <StartAt indexer={initIndexer} />
      <EndAt indexer={endIndexer} />
    </div>
  );
}

const MemoizedSalePeriodContent = memo(SalePeriodContent);

export default function TotalPeriod() {
  const initIndexer = useCoretimeSaleInitIndexer();
  const initHeight = initIndexer?.blockHeight;
  const { isLoading, indexer: endIndexer } = useCoretimeSaleEnd();

  const chainHeight = useAlwaysRelayHeight();
  const blockTime = useBlockTime();

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

  const remaining = estimateBlocksTime(remainingBlocksGap, blockTime);

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
            initIndexer={initIndexer}
            endIndexer={{
              blockHeight: endHeight,
              blockTime: endBlocksTime,
            }}
          />
        )}
      </SummaryItem>
    </SummaryColumnGap>
  );
}
