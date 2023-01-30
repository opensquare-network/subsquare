import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "../../store/reducers/chainSlice";
import { getBlockTimeByHeight } from "../blockTime";
import useApi from "./useApi";
import useIsMounted from "./useIsMounted";

export default function useLatestBlockTime() {
  const api = useApi();
  const isMounted = useIsMounted();
  const blockHeight = useSelector(latestHeightSelector);
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
