import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBlockTimeByHeight } from "../blockTime";
import { useMountedState } from "react-use";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useContextApi } from "next-common/context/api";

export default function useLatestBlockTime() {
  const api = useContextApi();
  const isMounted = useMountedState();
  const blockHeight = useSelector(chainOrScanHeightSelector);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (api) {
      getBlockTimeByHeight(api, blockHeight).then(
        (blockTime) => isMounted() && setTime(blockTime),
      );
    }
  }, [api, blockHeight, isMounted]);

  return time;
}
