import { createContext, useContext } from "react";
import useSubTargetReferendaDelegations from "../hooks/useSubTargetReferendaDelegations";

const ReferendaDelegationContext = createContext(null);

export default function ReferendaDelegationProvider({ children }) {
  const { result, isLoading, fetch } = useSubTargetReferendaDelegations();

  return (
    <ReferendaDelegationContext.Provider value={{ result, isLoading, fetch }}>
      {children}
    </ReferendaDelegationContext.Provider>
  );
}

export function useReferendaDelegationContext() {
  const context = useContext(ReferendaDelegationContext);
  return context;
}
