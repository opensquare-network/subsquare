import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useApi from "./useApi";
import { blockTimeSelector } from "../../store/reducers/chainSlice";
import { estimateBlocksTime } from "..";

export default function useVoteLockTime(conviction) {
  const api = useApi();
  const [time, setTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const blockTime = useSelector(blockTimeSelector);

  useEffect(() => {
    if (conviction === 0) {
      setTime("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (!api) {
      return;
    }

    const multiplier = Math.pow(2, conviction - 1);
    const blocks = (api.consts?.democracy?.voteLockingPeriod || 0) * multiplier;
    const timeArr = estimateBlocksTime(blocks, blockTime);
    setTime(timeArr.join(" "));

    setIsLoading(false);
  }, [api, conviction, blockTime]);

  return [time, isLoading];
}
