import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { extractTime } from "@polkadot/util";

export default function TimeDuration({ blocks = 0 }) {
  const blockTime = useSelector(blockTimeSelector);

  return useMemo(() => {
    const value = new BigNumber(blockTime).multipliedBy(blocks).toNumber();
    const time = extractTime(Math.abs(value));
    const { days, hours } = time;
    return [
      days ? `${days}d` : null,
      hours ? (hours > 1 ? `${hours}hrs` : "1hr") : null,
    ]
      .filter((s) => !!s)
      .join(" ");
  }, [blocks, blockTime]);
}
