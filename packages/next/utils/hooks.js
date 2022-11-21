import { useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { getAddressVotingBalance, getAddressVote } from "./referendumUtil";
import {
  getGov2AddressVote,
  getGov2TrackDelegation,
} from "./gov2ReferendumVote";

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
  }, [api, referendumIndex, address, isMounted]);
  return [vote, isLoading];
}

export function useGov2AddressVote(api, trackId, referendumIndex, address) {
  const [vote, setVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    getGov2AddressVote(api, trackId, referendumIndex, address)
      .then((vote) => {
        if (isMounted.current) {
          setVote(vote);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, trackId, referendumIndex, address, isMounted]);
  return [vote, isLoading];
}

export function useGov2TrackDelegating(api, trackId, address) {
  const [delegating, setDelegating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const refresh = async () => {
    setIsLoading(true);
    getGov2TrackDelegation(api, trackId, address)
      .then((delegating) => {
        if (isMounted.current) {
          setDelegating(delegating);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setDelegating(null);

    if (!api || !address) {
      return;
    }

    refresh();
  }, [api, trackId, address]);

  return { delegating, isLoading, refresh };
}
