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
import PassedTime from "./passedTime";
import TotalTime from "./totalTime";

function getEndBlocksTime(initBlocksTime, blockTime, blockGap) {
  return initBlocksTime + blockGap * blockTime;
}

export default function TotalPeriod() {
  const { initIndexer = {} } = useCoretimeSale();
  const { isLoading, indexer: endIndexer } = useCoretimeSaleEnd();

  const blockTime = useSelector(blockTimeSelector);
  const chainHeight = useSelector(chainOrScanHeightSelector);

  const initHeight = initIndexer?.blockHeight;
  const endHeight = endIndexer?.blockHeight;

  const totalBlockGap = endHeight - initHeight;
  const passedBlockGap = chainHeight - initHeight;
  const remainingBlocksGap = endHeight - chainHeight;

  const remaining = useRemainingTime(remainingBlocksGap);

  const percentage = getCountDownProgress(initHeight, chainHeight, endHeight);
  const endBlocksTime = getEndBlocksTime(
    initIndexer?.blockTime,
    blockTime,
    totalBlockGap,
  );

  const isFieldLoading = !initHeight || !endHeight || isLoading;

  const SalePeriodContent = () => {
    return (
      <div className="space-y-1">
        <PassedTime passedBlockGap={passedBlockGap} remaining={remaining} />
        <TotalTime totalBlockGap={totalBlockGap} />
        <EndAt endTime={endBlocksTime} />
      </div>
    );
  };

  return (
    <SummaryColumnGap>
      <SummaryItem
        title="Total Period"
        suffix={<SalePeriodCountdown percentage={percentage} />}
      >
        {isFieldLoading ? <FieldLoading /> : <SalePeriodContent />}
      </SummaryItem>
    </SummaryColumnGap>
  );
}
