import { useState, useEffect } from "react";
import { useMountedState } from "react-use";
import Chains from "../consts/chains";
import BigNumber from "bignumber.js";
import { useChain } from "../../context/chain";

const balanceMap = new Map();

async function queryKintsugiBalance(api, address, chain) {
  const token = Chains.kintsugi === chain ? "KINT" : "INTR";
  const account = await api.query.tokens.accounts(address, { token });
  return new BigNumber(account.free.toJSON())
    .plus(account.reserved.toJSON())
    .toString();
}

export async function querySystemAccountBalance(api, address) {
  const account = await api.query.system.account(address);
  return new BigNumber(account.data.free.toJSON())
    .plus(account.data.reserved.toJSON())
    .toString();
}

export default function useAddressBalance(api, address) {
  const chain = useChain();
  const isMounted = useMountedState();
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  useEffect(() => {
    if (!address) {
      return;
    }

    if (balanceMap.has(address)) {
      setBalance(balanceMap.get(address));
      setLoadingBalance(false);
      return;
    }

    if (!api) {
      return;
    }

    let promise;
    if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
      promise = queryKintsugiBalance(api, address, chain);
    } else {
      promise = querySystemAccountBalance(api, address);
    }

    promise
      .then((balance) => {
        if (isMounted()) {
          setBalance(balance);
          balanceMap.set(address, balance);
        }
      })
      .finally(() => {
        if (isMounted()) {
          setLoadingBalance(false);
        }
      });
  }, [api, chain, address, isMounted]);

  return [balance, loadingBalance];
}
