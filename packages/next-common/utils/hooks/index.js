import { useEffect, useState } from "react";
import { BN, BN_THOUSAND, BN_TWO, extractTime } from "@polkadot/util";
import useIsMounted from "./useIsMounted";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "../../store/reducers/chainSlice";
import BigNumber from "bignumber.js";

const DEFAULT_TIME = new BN(6_000);

export function useBlockTime(api) {
  const [blockTime, setBlockTime] = useState();
  useEffect(() => {
    if (!api) {
      return;
    }

    const THRESHOLD = BN_THOUSAND.div(BN_TWO);
    setBlockTime(
      api.consts?.babe?.expectedBlockTime ||
        // POW, eg. Kulupu
        api.consts?.difficulty?.targetBlockTime ||
        // Subspace
        api.consts?.subspace?.expectedBlockTime ||
        // Check against threshold to determine value validity
        (api.consts?.timestamp?.minimumPeriod.gte(THRESHOLD)
          ? // Default minimum period config
            api.consts?.timestamp.minimumPeriod.mul(BN_TWO)
          : api.query?.parachainSystem
          ? // default guess for a parachain
            DEFAULT_TIME.mul(BN_TWO)
          : // default guess for others
            DEFAULT_TIME)
    );
  }, [api]);
  return blockTime;
}

export function useSubscribeChainHead(api) {
  const [latestHeight, setLatestHeight] = useState(0);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (api) {
      api.rpc.chain.subscribeNewHeads((header) => {
        const latestUnFinalizedHeight = header.number.toNumber();
        if (isMounted.current) {
          setLatestHeight(latestUnFinalizedHeight);
        }
      });
    }
  }, [api]);

  return latestHeight;
}

export function useChainHeight(api) {
  const [height, setHeight] = useState(0);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (!api) {
      return;
    }

    api.derive.chain.bestNumber().then((best) => {
      if (isMounted.current) {
        setHeight(best.toNumber());
      }
    });
  }, [api]);

  return height;
}

export function useEstimateBlocksTime(blocks) {
  const blockTime = useSelector(blockTimeSelector);
  const [estimatedTime, setEstimatedTime] = useState("");
  useEffect(() => {
    const value = new BigNumber(blockTime).multipliedBy(blocks).toNumber();
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
  }, [blocks]);

  return estimatedTime;
}
