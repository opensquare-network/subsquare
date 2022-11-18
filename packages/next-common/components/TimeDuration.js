import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { extractTime } from "@polkadot/util";

export default function TimeDuration({
  blocks = 0,
  showDays = true,
  showHours = true,
  showMinutes = true,
}) {
  const blockTime = useSelector(blockTimeSelector);

  return useMemo(() => {
    const value = new BigNumber(blockTime).multipliedBy(blocks).toNumber();
    const time = extractTime(Math.abs(value));
    const { days, hours, minutes } = time;

    return [
      showDays && days ? `${days}d` : null,
      showHours && hours ? (hours > 1 ? `${hours}hrs` : "1hr") : null,
      showMinutes && minutes ? `${minutes}mins` : null,
    ]
      .filter((s) => !!s)
      .join(" ");
  }, [blocks, blockTime]);
}
