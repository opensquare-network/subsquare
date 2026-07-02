import usePendingSpends, {
  defaultPendingSpends,
} from "next-common/hooks/treasury/usePendingSpends";
import { createContext, useContext } from "react";

export const PendingSpendsContext = createContext(null);

export default function PendingSpendsProvider({ children }) {
  const {
    expiringSoonCount,
    validSoonCount,
    claimableCount,
    claimable,
    loading,
  } = usePendingSpends();

  return (
    <PendingSpendsContext.Provider
      value={{
        expiringSoonCount,
        validSoonCount,
        claimableCount,
        claimable,
        loading,
      }}
    >
      {children}
    </PendingSpendsContext.Provider>
  );
}

export function usePendingSpendsFromContext() {
  const context = useContext(PendingSpendsContext) ?? defaultPendingSpends;

  return context;
}
