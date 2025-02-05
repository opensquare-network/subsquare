import { createContext, useContext, useEffect, useState } from "react";
import { query } from "next-common/utils/hooks/fellowship/useFellowshipVotes";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import { partition } from "lodash-es";
import { useContextApi } from "next-common/context/api";

function useSubFellowshipVotes(pollIndex, indexer) {
  const api = useContextApi();
  const [fellowshipVotes, setFellowshipVotes] = useState({
    allAye: [],
    allNay: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || isNil(pollIndex)) {
      return;
    }

    query(api, pollIndex, indexer?.blockHash)
      .then((votes) => {
        const [allAye = [], allNay = []] = partition(votes, (v) => v.isAye);
        setFellowshipVotes({ allAye, allNay });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, pollIndex, indexer]);

  return { votes: fellowshipVotes, isLoading };
}

const FellowshipVotesContext = createContext(null);

export default function FellowshipVotesProvider({ children }) {
  const votingFinishIndexer = useReferendumVotingFinishIndexer();
  const { referendumIndex } = useOnchainData();

  const { votes, isLoading } = useSubFellowshipVotes(
    referendumIndex,
    votingFinishIndexer,
  );

  return (
    <FellowshipVotesContext.Provider value={{ isLoading, votes }}>
      {children}
    </FellowshipVotesContext.Provider>
  );
}

export function useFellowshipVotesContext() {
  return useContext(FellowshipVotesContext);
}
