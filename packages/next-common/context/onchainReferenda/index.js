import useOnChainReferenda from "next-common/hooks/referenda/useOnChainReferenda";

const { createContext, useContext } = require("react");

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
