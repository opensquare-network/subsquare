import SummaryItem from "next-common/components/summary/layout/item";
import { Item } from "next-common/components/coretime/salePanel/summary/common";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import CountDown from "next-common/components/_CountDown";

export default function CurrentPhaseEnd({ startHeight, endHeight }) {
  const chainHeight = useSelector(chainOrScanHeightSelector);
  const blockGap = endHeight - chainHeight;
  const estimatedBlocksTime = useEstimateBlocksTime(blockGap);

  return (
    <SummaryItem>
      <div className="text12Medium flex ">
        <Item label="End in" value={estimatedBlocksTime} />
        <CountDown
          numerator={endHeight - chainHeight}
          denominator={endHeight - startHeight}
        />
      </div>
    </SummaryItem>
  );
}
