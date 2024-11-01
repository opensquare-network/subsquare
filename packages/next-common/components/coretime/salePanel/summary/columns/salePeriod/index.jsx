import SummaryItem from "next-common/components/summary/layout/item";
import { SummaryColumnGap } from "../../common";
import SalePeriodCountdown from "./countdown";
import FieldLoading from "next-common/components/icons/fieldLoading";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import useCoretimeSaleEnd from "next-common/context/coretime/hooks/useCoretimeSaleEnd";
import { getCountDownProgress } from "../currentPhase/common";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useRemainingTime } from "next-common/components/remaining";
import EndAt from "./endAt";
import PassedTimeWithTooltip from "./passedTimeWithTooltip";
import TotalTime from "./totalTime";

function getEndBlocksTime(initBlocksTime, blockTime, blockGap) {
  return initBlocksTime + blockGap * blockTime;
}

// TODO: style && mobile countdown
function SalePeriodContentWithNullGuard({
  isLoading,
  endIndexer,
  initIndexer,
}) {
  const blockTime = useSelector(blockTimeSelector);
  const chainHeight = useSelector(chainOrScanHeightSelector);
  const initHeight = initIndexer?.blockHeight;
  const endHeight = endIndexer?.blockHeight;

  const totalBlockGap = endHeight - initHeight;
  const passedBlockGap = chainHeight - initHeight;
  const remainingBlocksGap = endHeight - chainHeight;

  const endBlocksTime = getEndBlocksTime(
    initIndexer?.blockTime,
    blockTime,
    totalBlockGap,
  );

  const remaining = useRemainingTime(remainingBlocksGap);

  if (!initHeight || !endHeight || isLoading) {
    return <FieldLoading />;
  }

  return (
    <div className="space-y-1">
      <PassedTimeWithTooltip
        passedBlockGap={passedBlockGap}
        remaining={remaining}
      />
      <TotalTime totalBlockGap={totalBlockGap} />
      <EndAt endTime={endBlocksTime} />
    </div>
  );
}

export default function SalePeriod() {
  const { initIndexer = {} } = useCoretimeSale();
  const { isLoading, indexer } = useCoretimeSaleEnd();

  const chainHeight = useSelector(chainOrScanHeightSelector);
  const initHeight = initIndexer?.blockHeight;
  const endHeight = indexer?.blockHeight;
  const percentage = getCountDownProgress(initHeight, chainHeight, endHeight);

  return (
    <SummaryColumnGap>
      <SummaryItem
        title="Sale Period"
        suffix={<SalePeriodCountdown percentage={percentage} />}
      >
        <SalePeriodContentWithNullGuard
          isLoading={isLoading}
          endIndexer={indexer}
          initIndexer={initIndexer}
        />
      </SummaryItem>
    </SummaryColumnGap>
  );
}
