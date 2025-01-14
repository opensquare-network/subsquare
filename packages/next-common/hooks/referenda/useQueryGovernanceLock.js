import { useMemo } from "react";
import useCall from "next-common/utils/hooks/useCall";
import { useContextApi } from "next-common/context/api";
import BigNumber from "bignumber.js";

export default function useQueryGovernanceLock(address) {
  const api = useContextApi();

  const { value: rawLocks, loading } = useCall(
    api?.query?.convictionVoting?.classLocksFor,
    [address],
  );

  return useMemo(() => {
    if (loading || !rawLocks) {
      return {
        isLoading: loading,
        balance: null,
      };
    }

    const maxLockedValue = rawLocks.reduce((max, rawLock) => {
      const locked = rawLock[1].toString();
      return new BigNumber(locked).gt(max) ? locked : max;
    }, "0");

    return {
      isLoading: loading,
      balance: maxLockedValue,
    };
  }, [rawLocks, loading]);
}
