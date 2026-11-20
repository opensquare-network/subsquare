import { isNil } from "lodash-es";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useContextApi } from "next-common/context/api";
import { useEffect, useMemo, useState } from "react";
import { getBlockTimeByHeight } from "next-common/utils/blockTime";
import BigNumber from "bignumber.js";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import {
  demoBlockTimeAtHeight,
  isPayoutQueueDemoEnabled,
} from "next-common/utils/payoutQueueDemo";

export default function useBlockTimestamp(height, specifiedApi = null) {
  const contextApi = useContextApi();
  const api = specifiedApi ?? contextApi;
  const oneBlockTime = useSelector(blockTimeSelector);
  const chainHeight = useAhmLatestHeight();
  const [timestamp, setTimestamp] = useState(null);
  const [isEstimated, setIsEstimated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isBlockLoaded = chainHeight >= height;
  // Demo chain data uses its own block time, the real chain times do not apply.
  const demoTime =
    isPayoutQueueDemoEnabled() && !isNil(height)
      ? demoBlockTimeAtHeight(height)
      : null;

  useEffect(() => {
    if (demoTime) {
      setTimestamp(demoTime);
      setIsEstimated(false);
      return;
    }

    if (isBlockLoaded && api) {
      return;
    }

    const now = new Date().getTime();
    setTimestamp(
      BigNumber(oneBlockTime)
        .multipliedBy(height - chainHeight)
        .plus(now)
        .toNumber(),
    );
    setIsEstimated(true);
  }, [api, height, chainHeight, isBlockLoaded, oneBlockTime, demoTime]);

  useEffect(() => {
    if (demoTime || !isBlockLoaded || !api) {
      return;
    }

    setIsLoading(true);
    getBlockTimeByHeight(api, height)
      .then((v) => setTimestamp(v))
      .finally(() => setIsLoading(false));
  }, [api, height, isBlockLoaded, demoTime]);

  return {
    timestamp,
    isEstimated,
    isLoading,
  };
}

export function useCalculatedBlockTimestamp(height) {
  const oneBlockTime = useSelector(blockTimeSelector);
  const chainHeight = useAhmLatestHeight();

  return useMemo(() => {
    if (!oneBlockTime || !chainHeight || !height) {
      return null;
    }
    return calculateBlockTimestamp(height, oneBlockTime, chainHeight);
  }, [height, oneBlockTime, chainHeight]);
}

export function calculateBlockTimestamp(height, oneBlockTime, chainHeight) {
  const now = new Date().getTime();
  const heightDiff = height - chainHeight;
  return BigNumber(oneBlockTime).multipliedBy(heightDiff).plus(now).toNumber();
}
