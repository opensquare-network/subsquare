import { useEffect, useState } from "react";
import { BN_THOUSAND, BN_TWO, bnToBn, extractTime } from "@polkadot/util";
import { useApi } from "@subsquare/next/utils/hooks";

export function useBlockTime(api) {
  const [blockTime, setBlockTime] = useState();
  useEffect(() => {
    if (!api) {
      return;
    }

    const THRESHOLD = BN_THOUSAND.div(BN_TWO);
    setBlockTime(
      api.consts.babe?.expectedBlockTime ||
        // POW, eg. Kulupu
        api.consts.difficulty?.targetBlockTime ||
        // Subspace
        api.consts.subspace?.expectedBlockTime ||
        // Check against threshold to determine value validity
        (api.consts.timestamp?.minimumPeriod.gte(THRESHOLD)
          ? // Default minimum period config
            api.consts.timestamp.minimumPeriod.mul(BN_TWO)
          : api.query.parachainSystem
          ? // default guess for a parachain
            DEFAULT_TIME.mul(BN_TWO)
          : // default guess for others
            DEFAULT_TIME)
    );
  }, [api]);
  return blockTime;
}

export function useBestNumber(api) {
  const [bestNumber, setBestNumber] = useState();
  useEffect(() => {
    if (api) {
      api.derive.chain
        .bestNumber()
        .then((result) => setBestNumber(result))
        .catch((e) => console.error(e));
    }
  }, [api]);
  return bestNumber;
}

export function useEstimateBlocksTime(blocks, chain) {
  const api = useApi(chain);
  const singleBlockTime = useBlockTime(api);
  const [estimatedTime, setEstimatedTime] = useState("");
  useEffect(() => {
    if (api && singleBlockTime) {
      const value = singleBlockTime.mul(bnToBn(blocks)).toNumber();
      const time = extractTime(Math.abs(value));
      const { days, hours, minutes, seconds } = time;
      const timeStr = [
        days ? (days > 1 ? `${days} days` : "1 day") : null,
        hours ? (hours > 1 ? `${hours} hrs` : "1 hr") : null,
        minutes ? (minutes > 1 ? `${minutes} mins` : "1 min") : null,
        seconds ? (seconds > 1 ? `${seconds} s` : "1 s") : null,
      ]
        .filter((s) => !!s)
        .slice(0, 2)
        .join(" ");

      setEstimatedTime(timeStr);
    }
  }, [blocks, api, singleBlockTime]);

  return estimatedTime;
}
