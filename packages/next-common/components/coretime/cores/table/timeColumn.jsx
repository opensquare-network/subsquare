import useRelayChainBlockTime from "next-common/context/coretime/hooks/useRelayChainBlockTime";
import useAhmLatestHeightSnapshot from "next-common/hooks/ahm/useAhmLatestHeightSnapshot";
import { isNil } from "lodash-es";
import { calculateBlockTimestamp } from "next-common/hooks/common/useBlockTimestamp";
import dayjs from "dayjs";
import Tooltip from "next-common/components/tooltip";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { CoreTimeTypes } from "../hooks/useAllCoreBrokers";
import { useSwitchTime } from "../context/switchTimeContext";
import Duration from "next-common/components/duration";

export default function TimeColumn({ height, type }) {
  const blockTime = useSelector(blockTimeSelector);
  const relayChainBlockTime = useRelayChainBlockTime();
  const { isTime } = useSwitchTime();

  const { latestHeight, isLoading } = useAhmLatestHeightSnapshot();
  if (isNil(height) || isLoading) {
    return <span className="text-textTertiary">-</span>;
  }

  const formattedDate = calculateBlockTimestamp(
    height,
    type === CoreTimeTypes.Lease ? blockTime : relayChainBlockTime,
    latestHeight,
  );

  if (!formattedDate) {
    return <span className="text-textTertiary">-</span>;
  }

  let content;
  if (isTime) {
    content = dayjs(formattedDate).format("YYYY-MM-DD");
  } else {
    content = <Duration time={formattedDate} />;
  }

  return (
    <Tooltip content={`#${height?.toLocaleString()}`}>
      <span className="text-textTertiary">{content}</span>
    </Tooltip>
  );
}
