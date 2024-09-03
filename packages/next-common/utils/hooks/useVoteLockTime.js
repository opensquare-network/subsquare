import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "../../store/reducers/chainSlice";
import { estimateBlocksTime } from "..";
import { useContextApi } from "next-common/context/api";

export default function useVoteLockTime(
  conviction,
  module = "convictionVoting",
) {
  const api = useContextApi();
  const [time, setTime] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const blockTime = useSelector(blockTimeSelector);

  useEffect(() => {
    if (conviction === 0) {
      setTime();
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (!api) {
      return;
    }

    const multiplier = Math.pow(2, conviction - 1);
    const blocks = (api.consts?.[module]?.voteLockingPeriod || 0) * multiplier;
    const time = estimateBlocksTime(blocks, blockTime);
    setTime(time);

    setIsLoading(false);
  }, [api, module, conviction, blockTime]);

  return [time, isLoading];
}
