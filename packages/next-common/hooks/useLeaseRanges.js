import { useMemo } from "react";
import { BN } from "@polkadot/util";
import { useContextApi } from "next-common/context/api";

const RANGES_DEFAULT = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 1],
  [1, 2],
  [1, 3],
  [2, 2],
  [2, 3],
  [3, 3],
];

function isU32(leasePeriodsPerSlot) {
  return !!leasePeriodsPerSlot;
}

export function useLeaseRanges() {
  const api = useContextApi();

  return useMemo(() => {
    if (isU32(api?.consts.auctions?.leasePeriodsPerSlot)) {
      const ranges = [];

      for (let i = 0; api?.consts.auctions.leasePeriodsPerSlot.gtn(i); i++) {
        for (let j = i; api?.consts.auctions.leasePeriodsPerSlot.gtn(j); j++) {
          ranges.push([i, j]);
        }
      }

      return ranges;
    }

    return RANGES_DEFAULT;
  }, [api]);
}

export function useLeaseRangeMax() {
  const ranges = useLeaseRanges();

  return useMemo(() => new BN(ranges[ranges.length - 1][1]), [ranges]);
}
