import { useEffect, useState } from "react";
import { getBlockTimeByHeight } from "../blockTime";

export default function useLatestBlockTime(api, blockHeight) {
  const [time, setTime] = useState(0);
  let unmounted = false;
  useEffect(() => {
    if (api) {
      getBlockTimeByHeight(api, blockHeight).then(
        (blockTime) => !unmounted && setTime(blockTime)
      );
    }
    return () => {
      unmounted = true;
    };
  }, [api, blockHeight]);

  return time;
}
