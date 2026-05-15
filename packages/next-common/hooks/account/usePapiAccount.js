import { useContextPapiApi } from "next-common/context/papi";
import { useEffect, useMemo, useState } from "react";

export function usePapiAccount(address) {
  const papi = useContextPapiApi();
  const [account, setAccount] = useState(null);
  const [locks, setLocks] = useState(null);
  const [locksLoaded, setLocksLoaded] = useState(false);
  const [stakingLedger, setStakingLedger] = useState(null);
  const [stakingLoaded, setStakingLoaded] = useState(false);

  useEffect(() => {
    if (!papi || !address) {
      return;
    }

    setAccount(null);
    setLocks(null);
    setLocksLoaded(false);
    setStakingLedger(null);
    setStakingLoaded(false);

    const accountSub = papi.query.System.Account.watchValue(address).subscribe(
      (data) => {
        // console.log("Received account data:", data);
        setAccount(data.value);
      },
    );

    let locksSub;
    if (papi.query.Balances?.Locks) {
      locksSub = papi.query.Balances.Locks.watchValue(address).subscribe(
        (data) => {
          // console.log("Received locks data:", data);
          setLocks(data.value ?? []);
          setLocksLoaded(true);
        },
      );
    } else {
      setLocks([]);
      setLocksLoaded(true);
    }

    let stakingSub;
    if (papi.query.Staking?.Ledger) {
      stakingSub = papi.query.Staking.Ledger.watchValue(address).subscribe(
        (data) => {
          // console.log("Received staking ledger data:", data);
          setStakingLedger(data.value ?? null);
          setStakingLoaded(true);
        },
      );
    } else {
      setStakingLoaded(true);
    }

    return () => {
      accountSub?.unsubscribe?.();
      locksSub?.unsubscribe?.();
      stakingSub?.unsubscribe?.();
    };
  }, [papi, address]);

  const data = useMemo(() => {
    if (!account || !locksLoaded || !stakingLoaded) {
      return null;
    }

    const lockedBalance =
      locks?.length > 0
        ? locks.reduce(
            (max, lock) => (lock.amount > max ? lock.amount : max),
            0n,
          )
        : 0n;

    return { account, lockedBalance, stakingLedger };
  }, [account, locks, locksLoaded, stakingLedger, stakingLoaded]);

  return { data, isLoading: data === null };
}
