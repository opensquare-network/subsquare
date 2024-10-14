import { useCallback, useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { getVotingBalance } from "./escrow/votingBalance";
import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export function useAddressVotingBalance(api, address) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useMountedState();

  const refresh = useCallback(() => {
    if (!api || !address) {
      setBalance(0);
      return;
    }

    setIsLoading(true);
    getVotingBalance(api, address)
      .then((value) => {
        if (isMounted()) {
          setBalance(value);
        }
      })
      .finally(() => {
        if (isMounted()) {
          setIsLoading(false);
        }
      });
  }, [api, address, isMounted]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [balance, isLoading, refresh];
}

export function useLatestAddressVotingBalance(api, address) {
  const [balance, isLoading, refresh] = useAddressVotingBalance(api, address);
  const latestHeight = useSelector(chainOrScanHeightSelector);

  useEffect(() => {
    refresh();
  }, [refresh, latestHeight]);

  return [balance, isLoading, refresh];
}
