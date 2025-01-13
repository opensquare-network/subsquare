import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import BigNumber from "bignumber.js";

const useQueryGovernanceLock = (address) => {
  const api = useContextApi();

  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    const fetchGovLocks = async () => {
      try {
        setIsLoading(true);
        const rawLocks = await api.query.convictionVoting.classLocksFor(
          address,
        );
        const normalized = rawLocks.map((rawLock) => {
          return {
            trackId: rawLock[0].toNumber(),
            locked: rawLock[1].toString(),
          };
        });

        const maxLockedValue = normalized.reduce((max, current) => {
          return new BigNumber(current.locked).gt(max) ? current.locked : max;
        }, "0");

        setBalance(maxLockedValue);
      } catch (error) {
        throw new Error(`Error fetching Governance Locks: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGovLocks();
  }, [api, address]);

  return { balance, isLoading };
};

export default useQueryGovernanceLock;
