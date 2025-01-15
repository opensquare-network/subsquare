import { useOnChainActiveReferenda } from "next-common/hooks/useOnChainActiveReferenda";
import { createContext, useContext } from "react";

const ActiveReferendaContext = createContext();

export default ActiveReferendaContext;

export function ActiveReferendaProvider({ pallet, children, api }) {
  const { activeReferenda, isLoading } = useOnChainActiveReferenda(pallet, api);

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
