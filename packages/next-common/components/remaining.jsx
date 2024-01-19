import { extractTime } from "@polkadot/util";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function Remaining({ blocks = 0, percentage }) {
  const blockTime = useSelector(blockTimeSelector);
  const ms = blockTime * blocks;
  const { days, hours, minutes } = extractTime(ms);

  const remaining = useMemo(() => {
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

  if (percentage) {
    return `${percentage}%, ${remaining}`;
  }
  return remaining;
}
