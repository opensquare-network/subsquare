import { useEffect, useState, useCallback, useMemo } from "react";
import { useContextApi } from "next-common/context/api";
import useAhmLatestHeightSnapshot from "next-common/hooks/ahm/useAhmLatestHeightSnapshot";
import {
  getCurrencyLockedByVesting,
  calculateVestingInfo,
} from "next-common/components/data/vesting/hooks/useAllVestingData";

export default function useAddressVestingData(address) {
  const api = useContextApi();
  const { latestHeight, isLoading: isHeightLoading } =
    useAhmLatestHeightSnapshot();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(
    async (silent = false) => {
      if (!api || !latestHeight || !address) {
        return;
      }

      try {
        if (!silent) {
          setIsLoading(true);
        }

        const vestingOption = await api.query.vesting.vesting(address);

        if (vestingOption.isNone) {
          setData(null);
          if (!silent) {
            setIsLoading(false);
          }
          return;
        }

        const schedules = vestingOption.unwrap();
        const locks = await api.query.balances.locks(address);
        const balancesLockedByVesting = getCurrencyLockedByVesting(locks);

        const vestingInfo = calculateVestingInfo(
          schedules,
          latestHeight,
          balancesLockedByVesting,
        );

        const result = {
          account: address,
          currentBalanceInLock: balancesLockedByVesting.toString(),
          totalVesting: vestingInfo.totalVesting,
          totalLockedNow: vestingInfo.totalLockedNow,
          unlockable: vestingInfo.totalUnlockable,
          schedules: vestingInfo.schedules,
          schedulesCount: schedules.length,
        };

        setData(result);
        if (!silent) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching profile vesting data:", error);
        if (!silent) {
          setData(null);
          setIsLoading(false);
        }
      }
    },
    [api, latestHeight, address],
  );

  useEffect(() => {
    if (isHeightLoading) {
      return;
    }

    fetchData();
  }, [fetchData, isHeightLoading]);

  const update = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return useMemo(
    () => ({
      data,
      isLoading,
      update,
    }),
    [data, isLoading, update],
  );
}
