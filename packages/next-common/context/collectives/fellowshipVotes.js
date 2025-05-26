import { createContext, useContext, useEffect, useState } from "react";
import { query } from "next-common/utils/hooks/fellowship/useFellowshipVotes";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import { partition } from "lodash-es";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

function useSubFellowshipVotes(pollIndex) {
  const api = useConditionalContextApi();
  const [fellowshipVotes, setFellowshipVotes] = useState({
    allAye: [],
    allNay: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || isNil(pollIndex)) {
      return;
    }

    query(api, pollIndex)
      .then((votes) => {
        const [allAye = [], allNay = []] = partition(votes, (v) => v.isAye);
        setFellowshipVotes({ allAye, allNay });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, pollIndex]);

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
