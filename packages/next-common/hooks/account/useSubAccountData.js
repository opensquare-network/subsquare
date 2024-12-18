import { useContextApi } from "next-common/context/api";
import useSubStorage from "../common/useSubStorage";
import { useEffect, useMemo, useState } from "react";
import { every, values } from "lodash-es";

export function useSubAccountData(address) {
  const [value, setValue] = useState(null);

  const api = useContextApi();
  const { result: account } = useSubStorage("system", "account", [address]);

  function update(newVal) {
    setValue((val) => {
      return { ...val, ...newVal };
    });
  }

  useEffect(() => {
    if (account) {
      update({ account });
    }
  }, [account]);

  useEffect(() => {
    if (!api || !address || !account) {
      return;
    }

    let unsubBalanceAll;
    let unsubStakingInfo;

    api.derive.balances
      .all(address, (balanceAll) => {
        update({ balanceAll });
      })
      .then((unsub) => {
        unsubBalanceAll = unsub;
      });

    api.derive.staking
      .account(address, (stakingInfo) => {
        update({ stakingInfo });
      })
      .then((unsub) => {
        unsubStakingInfo = unsub;
      });

    return () => {
      unsubBalanceAll?.();
      unsubStakingInfo?.();
    };
  }, [account, address, api]);

  const data = useMemo(() => {
    if (every(values(value), Boolean)) {
      return value;
    }

    return null;
  }, [value]);

  const loading = data === null;

  return { data, isLoading: loading };
}
