import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBlockTimeByHeight } from "../blockTime";
import useApi from "./useApi";
import useIsMounted from "./useIsMounted";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export default function useLatestBlockTime() {
  const api = useApi();
  const isMounted = useIsMounted();
  const blockHeight = useSelector(chainOrScanHeightSelector);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (api) {
      getBlockTimeByHeight(api, blockHeight).then(
        (blockTime) => isMounted.current && setTime(blockTime),
      );
    }
  }, [api, blockHeight]);

  return time;
}
