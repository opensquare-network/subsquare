import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { isNil } from "lodash-es";
import { useOnchainData } from "next-common/context/post";
import { useContextApi } from "next-common/context/api";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";

const ReferendumVotingContext = createContext();

function useFellowshipReferendumVotes() {
  const api = useContextApi();
  const [fellowshipVotes, setFellowshipVotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const pallet = useRankedCollectivePallet();
  const { referendumIndex: pollIndex } = useOnchainData();

  const fetch = useCallback(async () => {
    if (!api || isNil(pollIndex) || !pallet) {
      return;
    }

    try {
      setIsLoading(true);
      const votes = await api?.query?.[pallet]?.voting?.entries(pollIndex);
      setFellowshipVotes(votes);
    } catch (error) {
      console.error("Failed to fetch fellowship votes:", error);
      setFellowshipVotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [api, pollIndex, pallet]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    votes: fellowshipVotes,
    isLoading,
    fetch,
  };
}

export function useReferendumVotingUpdate() {
  const { fetch } = useFellowshipReferendumVotes();
  const { blockTime: settingBlockTime } = useChainSettings();

  return useCallback(async () => {
    const blockTime = settingBlockTime || defaultBlockTime;

    const timers = [1, 2];
    // eslint-disable-next-line no-unused-vars
    for (const timer of timers) {
      await fetch();
      await sleep(blockTime);
    }
  }, [settingBlockTime, fetch]);
}

export default function ReferendumVotingProvider({ children }) {
  const { votes, isLoading } = useFellowshipReferendumVotes();

  return (
    <ReferendumVotingContext.Provider value={{ votes, isLoading }}>
      {children}
    </ReferendumVotingContext.Provider>
  );
}

export function useReferendumVoting() {
  return useContext(ReferendumVotingContext);
}
