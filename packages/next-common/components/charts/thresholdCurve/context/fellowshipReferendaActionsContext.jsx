import useFellowshipReferendaActions from "next-common/components/pages/components/fellowship/referendum/sidebar/tally/voteActions/useFellowshipReferendaActions";
import { createContext, useContext } from "react";

const defaultValue = {
  loading: false,
  voteActions: [],
};

export const FellowshipReferendaActionsContext = createContext();

export function FellowshipReferendaActionsProvider({ children }) {
  const { loading, voteActions } = useFellowshipReferendaActions();
  return (
    <FellowshipReferendaActionsContext.Provider
      value={{ loading, voteActions }}
    >
      {children}
    </FellowshipReferendaActionsContext.Provider>
  );
}

export function useFellowshipReferendaActionsList() {
  return useContext(FellowshipReferendaActionsContext) || defaultValue;
}
