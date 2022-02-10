import { useEffect, useState } from "react";
import { BN_THOUSAND, BN_TWO } from "@polkadot/util";

export function useBlockTime(api) {
  const [blockTime, setBlockTime] = useState();
  useEffect(() => {
    if (api) {
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
    }
  }, [api]);
  return blockTime;
}

export function useBestNumber(api) {
  const [bestNumber, setBestNumber] = useState();
  useEffect(() => {
    if (api) {
      api.derive.chain.bestNumber().then((result) => setBestNumber(result));
    }
  }, [api]);
  return bestNumber;
}
