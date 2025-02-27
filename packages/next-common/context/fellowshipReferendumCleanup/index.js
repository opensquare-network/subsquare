import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { isNil } from "lodash-es";
import { useOnchainData } from "next-common/context/post";
import { useContextApi } from "next-common/context/api";
import { query } from "next-common/utils/hooks/fellowship/useFellowshipVotes";

const CleanupPollContext = createContext();

function useFellowshipReferendumVotes(pollIndex) {
  const api = useContextApi();
  const [fellowshipVotes, setFellowshipVotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVotes = useCallback(async () => {
    if (!api || isNil(pollIndex)) {
      return;
    }

    try {
      setIsLoading(true);
      const votes = await query(api, pollIndex);
      setFellowshipVotes(votes);
    } catch (error) {
      console.error("Failed to fetch fellowship votes:", error);
      setFellowshipVotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [api, pollIndex]);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  return {
    votes: fellowshipVotes,
    isLoading,
    fetchVotes,
  };
}

export default function FellowshipReferendumPollCleanupProvider({ children }) {
  const finishedIndexer = useReferendumVotingFinishIndexer();
  const isFinished = !isNil(finishedIndexer);
  const { referendumIndex } = useOnchainData();

  const { votes, fetchVotes, isLoading } =
    useFellowshipReferendumVotes(referendumIndex);

  return (
    <CleanupPollContext.Provider
      value={{ isFinished, votes, fetchVotes, isLoading }}
    >
      {children}
    </CleanupPollContext.Provider>
  );
}

export function useFellowshipReferendumCleanupPoll() {
  return useContext(CleanupPollContext);
}
