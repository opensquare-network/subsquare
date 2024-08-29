import dayjs from "dayjs";
import Duration from "next-common/components/duration";
import { useState } from "react";
import ExplorerLink from "next-common/components/links/explorerLink";

export function useAssetsTransfersHistoryTimeAgeColumn() {
  const [isTime, setIsTime] = useState(true);

  return {
    name: (
      <button
        className="text-theme500"
        onClick={() => {
          setIsTime(!isTime);
        }}
      >
        {isTime ? "Time" : "Age"}
      </button>
    ),
    className: "min-w-[160px]",
    render(item) {
      const time = item?.indexer?.blockTime;

      return (
        <ExplorerLink indexer={item?.indexer}>
          <div className="text-textTertiary hover:underline">
            {isTime ? (
              dayjs(time).format("YYYY-MM-DD HH:mm:ss")
            ) : (
              <Duration time={time} />
            )}
          </div>
        </ExplorerLink>
      );
    },
  };
}
