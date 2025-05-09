import { useEffect, useState } from "react";
import { getBlockTimeByHeight } from "../blockTime";
import { useMountedState } from "react-use";
import useChainOrScanHeight from "next-common/hooks/height";
import { useContextApi } from "next-common/context/api";

export default function useLatestBlockTime() {
  const api = useContextApi();
  const isMounted = useMountedState();
  const blockHeight = useChainOrScanHeight();
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
