import useRelayChainBlockTime from "next-common/context/coretime/hooks/useRelayChainBlockTime";
import useAhmLatestHeightSnapshot from "next-common/hooks/ahm/useAhmLatestHeightSnapshot";
import { isNil } from "lodash-es";
import { calculateBlockTimestamp } from "next-common/hooks/common/useBlockTimestamp";
import dayjs from "dayjs";
import Tooltip from "next-common/components/tooltip";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { CoreTimeTypes } from "../hooks/useAllCoreBrokers";

export default function TimeColumn({ height, type }) {
  const blockTime = useSelector(blockTimeSelector);
  const relayChainBlockTime = useRelayChainBlockTime();

  const { latestHeight, isLoading } = useAhmLatestHeightSnapshot();
  if (isNil(height) || isLoading) {
    return <span className="text-textTertiary">-</span>;
  }

  const formattedDate = calculateBlockTimestamp(
    height,
    type === CoreTimeTypes.Lease ? blockTime : relayChainBlockTime,
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
