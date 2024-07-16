import { useOnChainActiveReferenda } from "next-common/hooks/useOnChainActiveReferenda";

const { createContext, useContext } = require("react");

const ActiveReferendaContext = createContext();

export default ActiveReferendaContext;

export function ActiveReferendaProvider({ pallet, children }) {
  const activeReferenda = useOnChainActiveReferenda(pallet);

  return (
    <ActiveReferendaContext.Provider value={activeReferenda}>
      {children}
    </ActiveReferendaContext.Provider>
  );
}

export function useActiveReferenda() {
  return useContext(ActiveReferendaContext);
}
