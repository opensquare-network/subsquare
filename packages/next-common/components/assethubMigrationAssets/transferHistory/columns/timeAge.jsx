import dayjs from "dayjs";
import Duration from "next-common/components/duration";
import { useState } from "react";
import ExplorerLink from "next-common/components/links/explorerLink";
import { useChain } from "next-common/context/chain";

export function useAssetsTransfersHistoryTimeAgeColumn() {
  const [isTime, setIsTime] = useState(true);
  const chain = useChain();

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
    className: "min-w-[150px]",
    render(item) {
      const time = item?.indexer?.blockTime;
      const customDomain = `assethub-${chain}`;

      return (
        <ExplorerLink indexer={item?.indexer} customDomain={customDomain}>
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
