import { createContext, useContext } from "react";
import { useSubFellowshipVotes } from "next-common/utils/hooks/fellowship/useFellowshipVotes";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useOnchainData } from "next-common/context/post";

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
