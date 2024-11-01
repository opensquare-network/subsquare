import SummaryItem from "next-common/components/summary/layout/item";
import { Item, SummaryColumnGap } from "../../common";
import SalePeriodCountdown from "./countdown";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useCoretimeSaleInitHeight } from "next-common/context/coretime/sale/provider";
import { useSelector } from "react-redux";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import useCoretimeSaleEnd from "next-common/context/coretime/hooks/useCoretimeSaleEnd";
import FieldLoading from "next-common/components/icons/fieldLoading";

export default function SalePeriod() {
  const chainHeight = useSelector(chainOrScanHeightSelector);
  const initHeight = useCoretimeSaleInitHeight();
  const { isLoading, indexer } = useCoretimeSaleEnd();

  const totalBlockGap = indexer?.blockHeight - initHeight;
  const passedBlockGap = chainHeight - -initHeight;

  const totalBlocksTime = useEstimateBlocksTime(totalBlockGap);
  const passedBlocksTime = useEstimateBlocksTime(passedBlockGap);

  // TODO: compute data && style
  return (
    <SummaryColumnGap>
      <SummaryItem title="Sale Period">
        {isLoading ? (
          <FieldLoading />
        ) : (
          <div className="space-y-1">
            <div>{passedBlocksTime}</div>
            <div>/ {totalBlocksTime}</div>
            <div>
              <Item label="End At" value="[time]" />
            </div>
            <SalePeriodCountdown percentage={12} />
          </div>
        )}
      </SummaryItem>
    </SummaryColumnGap>
  );
}
