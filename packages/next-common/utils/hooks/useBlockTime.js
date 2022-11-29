import { useEffect, useState } from "react";
import { getBlockTimeByHeight } from "../blockTime";
import useApi from "./useApi";

export default function useLatestBlockTime(blockHeight, isMounted) {
  const api = useApi();
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (api) {
      getBlockTimeByHeight(api, blockHeight).then(
        (blockTime) => isMounted.current && setTime(blockTime)
      );
    }
  }, [api, blockHeight]);

  return time;
}
