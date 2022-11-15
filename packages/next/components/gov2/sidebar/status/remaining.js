import { extractTime } from "@polkadot/util";
import { useBlockTime } from "next-common/utils/hooks";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useMemo } from "react";

export default function Remaining({ blocks = 0 }) {
  const blockTime = useBlockTime(blockTimeSelector);
  const ms = blockTime * blocks;
  const { days, hours, minutes } = extractTime(ms);

  return useMemo(() => {
    return [
      days ? `${days}d` : "",
      hours ? `${hours}hrs` : "",
      minutes ? `${minutes}mins` : "",
      "remaining",
    ].join(" ");
  }, [blocks, blockTime, days, hours, minutes]);
}
