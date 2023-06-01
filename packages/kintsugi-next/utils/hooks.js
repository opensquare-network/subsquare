import { useCallback, useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { getVotingBalance } from "./escrow/votingBalance";
import { useSelector } from "react-redux";
import { nodesHeightSelector } from "next-common/store/reducers/nodeSlice";
import { getLockedBalance } from "./escrow/lockedBalance";

export function useAddressVotingBalance(api, address) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const refresh = useCallback(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    getVotingBalance(api, address)
      .then((value) => {
        if (isMounted.current) {
          setBalance(value);
        }
      })
      .finally(() => {
        if (isMounted.current) {
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
  const scanHeight = useSelector(nodesHeightSelector);

  useEffect(() => {
    refresh();
  }, [refresh, scanHeight]);

  return [balance, isLoading, refresh];
}

export function useLockedBalance(api, address) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const refresh = useCallback(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    getLockedBalance(api, address)
      .then((value) => {
        if (isMounted.current) {
          setBalance(value);
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      });
  }, [api, address, isMounted]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [balance, isLoading, refresh];
}
