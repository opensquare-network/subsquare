// start time
// end time

import dayjs from "dayjs";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";

export default function getCycleBlockTimeSummaryItem(
  title,
  blockTime,
  blockHeight,
) {
  return {
    title,
    content: (
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
    ),
  };
}
