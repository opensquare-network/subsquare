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
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import getChainSettings from "next-common/utils/consts/settings";

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

export async function fetchFellowshipReferendumVotes2Times(fetch) {
  const blockTime =
    getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
    defaultBlockTime;

  for (let i = 0; i < 2; i++) {
    await fetch();
    await sleep(blockTime);
  }
}

export default function ReferendumVotingProvider({ children }) {
  const { votes, isLoading, fetch } = useFellowshipReferendumVotes();

  return (
    <ReferendumVotingContext.Provider value={{ votes, isLoading, fetch }}>
      {children}
    </ReferendumVotingContext.Provider>
  );
}

export function useReferendumVoting() {
  return useContext(ReferendumVotingContext);
}
