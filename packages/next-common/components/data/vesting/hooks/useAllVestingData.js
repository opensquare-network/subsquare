import { useEffect, useState, useCallback, useMemo } from "react";
import { useContextPapiApi } from "next-common/context/papi";
import useAhmLatestHeightSnapshot from "next-common/hooks/ahm/useAhmLatestHeightSnapshot";
import { hexToString } from "@polkadot/util";
import { isNil } from "lodash-es";

function positiveOr0(v = 0n) {
  return v > 0n ? v : 0n;
}

export function getCurrencyLockedByVesting(locks) {
  const vestingLock = locks.find(
    (item) => hexToString(item.id.asHex()).trim() === "vesting",
  );
  if (!vestingLock) {
    return 0n;
  }

  return vestingLock.amount;
}

export function calculateVestingInfo(
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
    const startingBlock = BigInt(schedule.starting_block);
    const perBlock = schedule.per_block;
    const locked = schedule.locked;

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

function processVestingEntries(entries) {
  return entries.map((entry) => {
    const args = entry.args ?? entry.keyArgs;
    const account = args?.[0];
    const schedules = entry.value;
    return { account, schedules };
  });
}

export default function useAllVestingData() {
  const api = useContextPapiApi();
  const { latestHeight, isLoading: isHeightLoading } =
    useAhmLatestHeightSnapshot();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState("unlockable");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    if (!api || isHeightLoading || latestHeight == null) {
      return;
    }

    const unsub = api.query.Vesting.Vesting.watchEntries().subscribe(
      async (item) => {
        const { entries, deltas } = item;
        if (isNil(deltas)) {
          return;
        }

        if (!entries || entries.length === 0) {
          setData([]);
          setIsLoading(false);
          return;
        }

        const accountsData = processVestingEntries(entries);
        const accounts = accountsData.map((item) => item.account);

        try {
          if (accounts.length > 0) {
            const locksMulti = await api.query.Balances.Locks.getValues(
              accounts.map((account) => [account]),
            );

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

            setData(Array.from(accountsMap.values()));
          } else {
            setData([]);
          }
        } catch (error) {
          console.error("Error processing vesting data:", error);
          setData([]);
        } finally {
          setIsLoading(false);
        }
      },
    );

    return () => {
      unsub?.unsubscribe?.();
    };
  }, [api, latestHeight, isHeightLoading]);

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

  return useMemo(
    () => ({
      data: sortedData,
      isLoading,
      sortField,
      sortDirection,
      onSort: handleSort,
    }),
    [sortedData, isLoading, sortField, sortDirection, handleSort],
  );
}
