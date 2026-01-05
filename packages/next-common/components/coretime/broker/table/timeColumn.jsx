import useRelayChainBlockTime from "next-common/context/coretime/hooks/useRelayChainBlockTime";
import useAhmLatestHeightSnapshot from "next-common/hooks/ahm/useAhmLatestHeightSnapshot";
import { isNil } from "lodash-es";
import { calculateBlockTimestamp } from "next-common/hooks/common/useBlockTimestamp";
import dayjs from "dayjs";
import Tooltip from "next-common/components/tooltip";

export default function TimeColumn({ height }) {
  const blockTime = useRelayChainBlockTime();

  const { latestHeight, isLoading } = useAhmLatestHeightSnapshot();
  if (isNil(height) || isLoading) {
    return <span className="text-textTertiary">-</span>;
  }

  const formattedDate = calculateBlockTimestamp(
    height,
    blockTime,
    latestHeight,
  );

  return (
    <Tooltip content={`#${height?.toLocaleString()}`}>
      <span className="text-textTertiary">
        {dayjs(formattedDate).format("YYYY-MM-DD")}
      </span>
    </Tooltip>
  );
}
