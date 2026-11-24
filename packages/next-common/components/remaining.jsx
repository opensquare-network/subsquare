import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";

export function useRemainingTime(blocks, blockTime, dropInsignificant = false) {
  const chainBlockTime = useSelector(blockTimeSelector);
  const finalBlockTime = blockTime ?? chainBlockTime;
  const ms = finalBlockTime * blocks;
  const [duration, setDuration] = useState();

  useEffect(() => {
    if (isNil(blocks)) {
      return;
    }

    if (ms) {
      setDuration(formatTimeDuration(ms, { dropInsignificant }) + " remaining");
    }
  }, [ms, blocks, dropInsignificant]);

  return duration;
}

export default function Remaining({
  blocks = 0,
  percentage,
  blockTime,
  dropInsignificant = false,
}) {
  const remaining = useRemainingTime(blocks, blockTime, dropInsignificant);
  if (percentage && blocks > 0) {
    return `${percentage}%, ${remaining}`;
  } else if (percentage && blocks <= 0) {
    return `${percentage}%`;
  }
  return remaining;
}
