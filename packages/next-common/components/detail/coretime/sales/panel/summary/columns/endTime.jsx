import SummaryItem from "next-common/components/summary/layout/item";
import { SummaryColumnGap } from "next-common/components/coretime/salePanel/summary/common";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { formatBlockHeight } from "next-common/components/coretime/sales/history/timeRange";
import dayjs from "dayjs";
import { isNil } from "lodash-es";

export default function EndTime() {
  const { endIndexer } = useCoretimeSale();
  const { blockTime, blockHeight } = endIndexer || {};

  if (isNil(blockTime) || isNil(blockHeight)) {
    return null;
  }

  return (
    <SummaryColumnGap>
      <SummaryItem title="End Time">
        <div>
          {dayjs(blockTime).format("YYYY-MM-DD")}{" "}
          <span className="text-textTertiary">
            {dayjs(blockTime).format("HH:mm:ss")}
          </span>
        </div>
        <span className="text12Medium text-textSecondary">
          {formatBlockHeight(blockHeight)}
        </span>
      </SummaryItem>
    </SummaryColumnGap>
  );
}
