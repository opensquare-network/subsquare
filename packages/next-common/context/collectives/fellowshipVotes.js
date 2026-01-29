import { createContext, useContext, useEffect, useState } from "react";
import { queryFellowshipVotesOnServerOrChain } from "next-common/utils/hooks/fellowship/useFellowshipVotes";
import {
  useIsReferendumFinalState,
  useReferendumVotingFinishIndexer,
} from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
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
  const isReferendumFinalState = useIsReferendumFinalState();

  useEffect(() => {
    if (isNil(pollIndex)) {
      return;
    }
    queryFellowshipVotesOnServerOrChain(api, pollIndex, isReferendumFinalState)
      .then((votes) => {
        if (isNil(votes)) {
          return;
        }
        const [allAye = [], allNay = []] = partition(votes, (v) => v.isAye);
        setFellowshipVotes({ allAye, allNay });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, pollIndex, isReferendumFinalState]);

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
