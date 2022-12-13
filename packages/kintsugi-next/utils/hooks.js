import { useCallback, useEffect, useState } from "react";
import { getAddressVote } from "./referendumUtil";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { getVotingBalance } from "./escrow/votingBalance";

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

export function useAddressVote(api, referendumIndex, address) {
  const [vote, setVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    getAddressVote(api, referendumIndex, address)
      .then((vote) => {
        if (isMounted.current) {
          setVote(vote);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, referendumIndex, address, isMounted]);
  return [vote, isLoading];
}
