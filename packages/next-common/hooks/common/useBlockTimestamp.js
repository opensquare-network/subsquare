import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";
import { getBlockTimeByHeight } from "next-common/utils/blockTime";
import BigNumber from "bignumber.js";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

export default function useBlockTimestamp(height, specifiedApi = null) {
  const contextApi = useContextApi();
  const api = specifiedApi ?? contextApi;
  const oneBlockTime = useSelector(blockTimeSelector);
  const chainHeight = useAhmLatestHeight();
  const [timestamp, setTimestamp] = useState(null);
  const [isEstimated, setIsEstimated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chainHeight >= height && api) {
      setIsLoading(true);
      getBlockTimeByHeight(api, height)
        .then((v) => setTimestamp(v))
        .finally(() => setIsLoading(false));
    } else {
      const now = new Date().getTime();
      setTimestamp(
        BigNumber(oneBlockTime)
          .multipliedBy(height - chainHeight)
          .plus(now)
          .toNumber(),
      );
      setIsEstimated(true);
    }
  }, [api, height, chainHeight, oneBlockTime]);

  return {
    timestamp,
    isEstimated,
    isLoading,
  };
}
