import { extractTime } from "@polkadot/util";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";

export function useRemainingTime(blocks) {
  const blockTime = useSelector(blockTimeSelector);
  const ms = blockTime * blocks;
  const { days, hours, minutes } = extractTime(ms);

  if (isNil(blocks)) {
    return null;
  }

  return useMemo(() => {
    if (days > 30) {
      return `${days}days remaining`;
    }

    return [
      days ? `${days}d` : "",
      hours ? `${hours}hrs` : "",
      minutes ? `${minutes}mins` : "",
      "remaining",
    ].join(" ");
  }, [days, hours, minutes]);
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
