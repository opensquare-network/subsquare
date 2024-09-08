import useOnChainReferenda from "next-common/hooks/referenda/useOnChainReferenda";
import { createContext, useContext } from "react";

const OnChainReferendaContext = createContext();

export default OnChainReferendaContext;

export function OnChainReferendaProvider({ children }) {
  const { referenda, loaded } = useOnChainReferenda();
  return (
    <OnChainReferendaContext.Provider value={{ referenda, isLoading: !loaded }}>
      {children}
    </OnChainReferendaContext.Provider>
  );
}

export function useOnChainReferendaContext() {
  return useContext(OnChainReferendaContext);
}
