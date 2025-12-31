import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!api || isHeightLoading || !latestHeight) {
      return;
    }

    let cancelled = false;

    async function fetchData() {
      try {
        setIsLoading(true);

        const entries = await api.query.vesting.vesting.entries();

        if (cancelled) return;

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

        if (cancelled) return;

        const locksMulti = await api.query.balances.locks.multi(accounts);

        if (cancelled) return;

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

        if (!cancelled) {
          const results = Array.from(accountsMap.values()).sort((a, b) => {
            return Number(BigInt(b.totalVesting) - BigInt(a.totalVesting));
          });
          setData(results);
          setIsLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching vesting data:", error);
          setData([]);
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [api, latestHeight, isHeightLoading]);

  return {
    data,
    isLoading,
  };
}
