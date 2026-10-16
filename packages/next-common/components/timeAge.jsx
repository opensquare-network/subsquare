import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { isNil } from "lodash-es";
import Duration from "next-common/components/duration";
import ExplorerLink from "next-common/components/links/explorerLink";

/**
 * The moment an indexed entry happened, or how long ago it was, linked to the entry in the
 * explorer. The transfer history, the dotUSD swap records and the profile transfers all read
 * their times this way; only the domain of the explorer differs, so it comes in as a prop.
 */
export function TimeAgeCell({ indexer, isTime, customDomain }) {
  const blockTime = indexer?.blockTime;

  if (isNil(blockTime)) {
    return <span className="text14Medium text-textTertiary">—</span>;
  }

  return (
    <ExplorerLink indexer={indexer} customDomain={customDomain}>
      <div className="text-textTertiary hover:underline">
        {isTime ? (
          dayjs(blockTime).format("YYYY-MM-DD HH:mm:ss")
        ) : (
          <Duration time={blockTime} />
        )}
      </div>
    </ExplorerLink>
  );
}

// The header of the time column, which toggles between the two readings of the time.
export function TimeAgeToggle({ isTime, onToggle }) {
  return (
    <button type="button" className="text-theme500" onClick={onToggle}>
      {isTime ? "Time" : "Age"}
    </button>
  );
}

export function useTimeAge() {
  const [isTime, setIsTime] = useState(true);
  const onToggle = useCallback(() => setIsTime((value) => !value), []);

  return { isTime, onToggle };
}
