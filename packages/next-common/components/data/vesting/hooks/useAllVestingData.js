import { useEffect, useState, useCallback, useMemo } from "react";
import { useContextApi } from "next-common/context/api";
import useAhmLatestHeightSnapshot from "next-common/hooks/ahm/useAhmLatestHeightSnapshot";
import { hexToString } from "@polkadot/util";

function positiveOr0(v = 0n) {
  return v > 0n ? v : 0n;
}

function getCurrencyLockedByVesting(locks) {
  const vestingLock = locks.find(
    (item) => hexToString(item.id.toHex()).trim() === "vesting",
  );
  if (!vestingLock) {
    return 0n;
  }

  return vestingLock.amount.toBigInt();
}

function calculateVestingInfo(
  schedules,
  currentHeight,
  balancesLockedByVesting,
) {
  const nowHeightBigInt = BigInt(currentHeight);
  const balancesLockedBigInt = BigInt(balancesLockedByVesting || 0);

  let totalLockedNow = 0n;
  let totalMatureNow = 0n;
  let totalVesting = 0n;

  const schedulesWithDetails = schedules.map((schedule) => {
    const startingBlock = schedule.startingBlock.toBigInt();
    const perBlock = schedule.perBlock.toBigInt();
    const locked = schedule.locked.toBigInt();

    const vestedBlockCount = positiveOr0(nowHeightBigInt - startingBlock);
    const unlockableNow = vestedBlockCount * perBlock;
    const lockedNow = locked > unlockableNow ? locked - unlockableNow : 0n;

    totalLockedNow += lockedNow;
    totalMatureNow += unlockableNow;
    totalVesting += locked;

    return {
      startingBlock: startingBlock.toString(),
      perBlock: perBlock.toString(),
      locked: locked.toString(),
      lockedNow: lockedNow.toString(),
      unlockableNow: unlockableNow.toString(),
    };
  });

  const totalUnlockable =
    balancesLockedBigInt > totalLockedNow
      ? balancesLockedBigInt - totalLockedNow
      : 0n;

  const schedulesWithUnlockable = schedulesWithDetails.map((schedule) => {
    const unlockableNow = BigInt(schedule.unlockableNow);

    let unlockable = 0n;
    if (totalMatureNow > 0n && unlockableNow > 0n) {
      unlockable = (totalUnlockable * unlockableNow) / totalMatureNow;
    }

    return {
      ...schedule,
      unlockable: unlockable.toString(),
    };
  });

  return {
    totalLockedNow: totalLockedNow.toString(),
    totalUnlockable: totalUnlockable.toString(),
    totalVesting: totalVesting.toString(),
    schedules: schedulesWithUnlockable,
  };
}

export default function useAllVestingData() {
  const api = useContextApi();
  const { latestHeight, isLoading: isHeightLoading } =
    useAhmLatestHeightSnapshot();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState("unlockable");
  const [sortDirection, setSortDirection] = useState("desc");

  const fetchData = useCallback(
    async (silent = false) => {
      if (!api || !latestHeight) {
        return;
      }

      try {
        if (!silent) {
          setIsLoading(true);
        }

        const entries = await api.query.vesting.vesting.entries();

        const accountsData = [];
        const accounts = [];

        for (const [storageKey, optionalStorage] of entries) {
          if (optionalStorage.isNone) {
            continue;
          }

          const account = storageKey.args[0].toString();
          const schedules = optionalStorage.unwrap();

          accounts.push(account);
          accountsData.push({
            account,
            schedules,
          });
        }

        const locksMulti = await api.query.balances.locks.multi(accounts);

        const accountsMap = new Map();
        accountsData.forEach((item, index) => {
          const locks = locksMulti[index];
          const balancesLockedByVesting = getCurrencyLockedByVesting(locks);

          const vestingInfo = calculateVestingInfo(
            item.schedules,
            latestHeight,
            balancesLockedByVesting,
          );

          accountsMap.set(item.account, {
            account: item.account,
            currentBalanceInLock: balancesLockedByVesting.toString(),
            totalVesting: vestingInfo.totalVesting,
            totalLockedNow: vestingInfo.totalLockedNow,
            unlockable: vestingInfo.totalUnlockable,
            schedules: vestingInfo.schedules,
            schedulesCount: item.schedules.length,
          });
        });

        const results = Array.from(accountsMap.values());

        setData(results);
        if (!silent) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching vesting data:", error);
        if (!silent) {
          setData([]);
          setIsLoading(false);
        }
      }
    },
    [api, latestHeight],
  );

  useEffect(() => {
    if (isHeightLoading) {
      return;
    }

    fetchData();
  }, [fetchData, isHeightLoading]);

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      let aValue, bValue;

      if (sortField === "unlockable") {
        aValue = BigInt(a.unlockable);
        bValue = BigInt(b.unlockable);
      } else if (sortField === "currentBalanceInLock") {
        aValue = BigInt(a.currentBalanceInLock);
        bValue = BigInt(b.currentBalanceInLock);
      } else {
        return 0;
      }

      const diff =
        sortDirection === "asc"
          ? Number(aValue - bValue)
          : Number(bValue - aValue);

      return diff;
    });

    return sorted;
  }, [data, sortField, sortDirection]);

  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("desc");
      }
    },
    [sortField, sortDirection],
  );

  const update = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return useMemo(
    () => ({
      data: sortedData,
      isLoading,
      sortField,
      sortDirection,
      onSort: handleSort,
      update,
    }),
    [sortedData, isLoading, sortField, sortDirection, handleSort, update],
  );
}
