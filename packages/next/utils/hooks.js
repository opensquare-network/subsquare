import { useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import {
  getAddressVotingBalance,
  getAddressVote,
  getElectorate,
} from "./referendumUtil";

export function useElectorate(api, height, tally) {
  const [electorate, setElectorate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (tally.electorate) {
      if (isMounted.current) {
        setElectorate(tally.electorate);
      }
      return
    }

    if (!api) {
      return
    }

    setIsLoading(true);
    getElectorate(api, height).then((value) => {
      if (isMounted.current) {
        setElectorate(value);
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }, [api, height, tally, isMounted]);

  return [electorate, isLoading];
}

export function useLoaded(isLoading) {
  const [loadStatus, setLoadStatus] = useState(0);
  useEffect(() => {
    if (loadStatus === 0 && isLoading) {
      setLoadStatus(1);
    }
    if (loadStatus === 1 && !isLoading) {
      setLoadStatus(2);
    }
  }, [isLoading]);

  return loadStatus === 2;
}

export function useAddressVotingBalance(api, address) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (api && address) {
      setIsLoading(true);
      getAddressVotingBalance(api, address)
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
    }
  }, [api, address]);
  return [balance, isLoading];
}

export function useAddressVote(api, referendumIndex, address) {
  const [vote, setVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (api && address) {
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
    }
  }, [api, referendumIndex, address]);
  return [vote, isLoading];
}
