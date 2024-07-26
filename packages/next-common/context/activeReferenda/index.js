import { useOnChainActiveReferenda } from "next-common/hooks/useOnChainActiveReferenda";

const { createContext, useContext } = require("react");

const ActiveReferendaContext = createContext();

export default ActiveReferendaContext;

export function ActiveReferendaProvider({ pallet, children }) {
  const { activeReferenda, isLoading } = useOnChainActiveReferenda(pallet);

  return (
    <ActiveReferendaContext.Provider value={{ activeReferenda, isLoading }}>
      {children}
    </ActiveReferendaContext.Provider>
  );
}

export function useActiveReferendaContext() {
  return useContext(ActiveReferendaContext);
}

export function useActiveReferenda() {
  const { activeReferenda } = useActiveReferendaContext();
  return activeReferenda;
}
