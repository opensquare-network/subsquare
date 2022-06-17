import React from "react";
import { useState, useEffect } from "react";
import useIsMounted from "./useIsMounted";

const balanceMap = new Map();

export default function useAddressBalance(api, address) {
  const isMounted = useIsMounted();
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    if (balanceMap.has(address)) {
      setBalance(balanceMap.get(address));
      return;
    }
    if (api) {
      setLoadingBalance(true);
      api.query.system
        .account(address)
        .then((result) => {
          if (isMounted.current) {
            setBalance(result.data.free.toJSON());
            balanceMap.set(address, result.data.free.toJSON());
          }
        })
        .finally(() => {
          if (isMounted.current) {
            setLoadingBalance(false);
          }
        });
    }
  }, [api, address, isMounted]);

  return [balance, loadingBalance];
}
