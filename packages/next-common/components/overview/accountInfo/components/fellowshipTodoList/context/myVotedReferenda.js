import useFetchMyReferendaVoting from "next-common/components/myvotes/referenda/useFetchMyReferendaVoting";
import useMyVotedReferenda from "next-common/hooks/referenda/useMyVotedReferenda";
import { createContext, useContext } from "react";

const MyVotedReferendaContext = createContext();

export default MyVotedReferendaContext;

export function MyVotedReferendaProvider({ children }) {
  useFetchMyReferendaVoting();
  const { myVotedReferenda, isLoading } = useMyVotedReferenda();

  return (
    <MyVotedReferendaContext.Provider value={{ myVotedReferenda, isLoading }}>
      {children}
    </MyVotedReferendaContext.Provider>
  );
}

export function useContextMyVotedReferenda() {
  return useContext(MyVotedReferendaContext);
}
