import useApi from "next-common/utils/hooks/useApi";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useEffect, useState } from "react";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { querySystemAccountBalance } from "next-common/utils/hooks/useAddressBalance";
import getKintsugiVotingBalance from "next-common/utils/account/getKintsugiVotingBalance";
import useIsMounted from "next-common/utils/hooks/useIsMounted";

export default function useVotingBalance(address) {
  const api = useApi();
  const latestHeight = useSelector(latestHeightSelector);
  const chain = useChain();
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!address || !api) {
      setLoadingBalance(false);
      return;
    }

    let promise;
    if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
      promise = getKintsugiVotingBalance(api, address);
    } else {
      promise = querySystemAccountBalance(api, address);
    }

    setLoadingBalance(true);
    promise
      .then((balance) => {
        if (isMounted.current) {
          setBalance(balance);
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setLoadingBalance(false);
        }
      });
  }, [api, address, chain, isMounted, latestHeight]);

  return {
    balance,
    isLoading: loadingBalance,
  };
}
