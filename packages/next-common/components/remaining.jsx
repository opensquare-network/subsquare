import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";

export function useRemainingTime(blocks) {
  const blockTime = useSelector(blockTimeSelector);
  const ms = blockTime * blocks;

  if (isNil(blocks)) {
    return null;
  }

  return useMemo(() => {
    return formatTimeDuration(ms) + " remaining";
  }, [ms]);
}

export default function Remaining({ blocks = 0, percentage }) {
  const remaining = useRemainingTime(blocks);
  if (percentage && blocks > 0) {
    return `${percentage}%, ${remaining}`;
  } else if (percentage && blocks <= 0) {
    return `${percentage}%`;
  }
  return remaining;
}
