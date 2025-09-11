import dayjs from "dayjs";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";

export default function SalaryStatsBlockTimeItem({
  title,
  blockTime,
  blockHeight,
}) {
  return (
    <SummaryItem title={title}>
      <LoadableContent isLoading={isNil(blockTime)}>
        <div>
          {dayjs(blockTime).format("YYYY-MM-DD")}{" "}
          <span className="text-textTertiary">
            {dayjs(blockTime).format("HH:mm:ss")}
          </span>
        </div>
        {!isNil(blockHeight) && (
          <div className="text12Medium text-textSecondary !ml-0">
            #{blockHeight?.toLocaleString?.()}
          </div>
        )}
      </LoadableContent>
    </SummaryItem>
  );
}
