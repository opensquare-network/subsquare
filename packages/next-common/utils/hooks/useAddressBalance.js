import React from "react";
import { useState, useEffect } from "react";
import useIsMounted from "./useIsMounted";
import Chains from "../consts/chains";
import BigNumber from "bignumber.js";

const balanceMap = new Map();

async function queryKintsugiBalance(api, address) {
  const account = await api.query.tokens.accounts(address, { token: "KINT" });
  return new BigNumber(account.free.toJSON())
    .plus(account.reserved.toJSON())
    .toString();
}

async function querySystemAccountBalance(api, address) {
  const account = await api.query.system.account(address);
  return new BigNumber(account.data.free.toJSON())
    .plus(account.data.reserved.toJSON())
    .toString();
}

export default function useAddressBalance(api, address, chain) {
  const isMounted = useIsMounted();
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    if (balanceMap.has(address)) {
      setBalance(balanceMap.get(address));
      return;
    }

    if (!api) {
      return;
    }

    let promise;
    if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
      promise = queryKintsugiBalance(api, address);
    } else {
      promise = querySystemAccountBalance(api, address);
    }

    setLoadingBalance(true);
    promise
      .then((balance) => {
        console.log("balance", balance);
        if (isMounted.current) {
          setBalance(balance);
          balanceMap.set(address, balance);
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setLoadingBalance(false);
        }
      });
  }, [api, chain, address, isMounted]);

  return [balance, loadingBalance];
}
