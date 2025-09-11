import { createContext, useContext } from "react";
import useOnChainReferendaTracks from "next-common/hooks/referenda/useOnChainReferendaTracks";

const OnChainReferendaTracksContext = createContext();

export default OnChainReferendaTracksContext;

export function OnChainReferendaTracksProvider({ children }) {
  const { tracks, isLoading } = useOnChainReferendaTracks();
  return (
    <OnChainReferendaTracksContext.Provider value={{ tracks, isLoading }}>
      {children}
    </OnChainReferendaTracksContext.Provider>
  );
}

export function useReferendaTracks() {
  return useContext(OnChainReferendaTracksContext);
}
