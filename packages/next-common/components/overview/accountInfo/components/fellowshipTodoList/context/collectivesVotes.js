import { createContext, useContext } from "react";
import useCollectivesReferendaVotes from "next-common/hooks/referenda/useCollectivesReferendaVotes";

export const CollectivesReferendaVotesContext = createContext();

export default function CollectivesReferendaVotesProvider({ children }) {
  const { votes, isLoading } = useCollectivesReferendaVotes();

  return (
    <CollectivesReferendaVotesContext.Provider value={{ votes, isLoading }}>
      {children}
    </CollectivesReferendaVotesContext.Provider>
  );
}

export function useContextCollectivesReferendaVotes() {
  return useContext(CollectivesReferendaVotesContext);
}
