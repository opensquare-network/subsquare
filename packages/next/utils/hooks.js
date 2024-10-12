import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import {
  getAddressVote,
  getAddressVotingBalance,
} from "next-common/utils/referendumUtil";

export function useAddressVotingBalance(api, address) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useMountedState();
  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    getAddressVotingBalance(api, address)
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
  return [balance, isLoading];
}

export function useAddressVote(api, referendumIndex, address, updateTime) {
  const [vote, setVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useMountedState();

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    getAddressVote(api, referendumIndex, address)
      .then((vote) => {
        if (isMounted()) {
          setVote(vote);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, referendumIndex, address, isMounted, updateTime]);

  return [vote, isLoading];
}
