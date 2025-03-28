import { useContext, createContext } from "react";
import useDelegationAnnouncement from "../hooks/useDelegationAnnouncement";

const DelegationGuidanceContext = createContext();

export default function DelegationGuidanceProvider({
  children,
  pallet = "referenda",
}) {
  const { data, isLoading } = useDelegationAnnouncement(pallet);

  return (
    <DelegationGuidanceContext.Provider
      value={{
        data,
        isLoading,
        pallet,
      }}
    >
      {children}
    </DelegationGuidanceContext.Provider>
  );
}

export function useDelegationGuidanceContext() {
  const context = useContext(DelegationGuidanceContext);
  return context || {};
}
