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

    api.derive.balances.all(address, (balanceAll) => {
      update({ balanceAll });
    });

    api.derive.staking.account(address, (stakingInfo) => {
      update({ stakingInfo });
    });
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
