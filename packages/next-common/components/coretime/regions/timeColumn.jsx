import Tooltip from "next-common/components/tooltip";
import { calculateBlockTimestamp } from "next-common/hooks/common/useBlockTimestamp";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";
import dayjs from "dayjs";
import { isNil } from "lodash-es";
import { useRegionTimeContext } from "./context";

export function RegionTimeHeaderButton({ name, ageName }) {
  const { isTime, toggleIsTime } = useRegionTimeContext();

  return (
    <button className="text-theme500" onClick={toggleIsTime}>
      {isTime ? name : ageName}
    </button>
  );
}

export default function RegionTimeColumn({ height }) {
  const { isTime, isLoading, latestHeight, now, relayChainBlockTime } =
    useRegionTimeContext();

  if (isNil(height) || isLoading) {
    return <span className="text-textTertiary">-</span>;
  }

  const timestamp = calculateBlockTimestamp(
    height,
    relayChainBlockTime,
    latestHeight,
  );

  if (!timestamp) {
    return <span className="text-textTertiary">-</span>;
  }

  return (
    <Tooltip content={`#${height.toLocaleString()}`}>
      <span className="text-textTertiary">
        {isTime
          ? dayjs(timestamp).format("YYYY-MM-DD")
          : formatTimeAgo(timestamp, { referenceTime: now })}
      </span>
    </Tooltip>
  );
}
