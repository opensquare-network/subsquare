import { useContext, createContext } from "react";
import useDelegationAnnouncement from "../hooks/useDelegationAnnouncement";

const DelegationGuideContext = createContext();

export default function DelegationGuideProvider({
  children,
  pallet = "referenda",
}) {
  const { data, isLoading } = useDelegationAnnouncement(pallet);

  return (
    <DelegationGuideContext.Provider
      value={{
        data,
        isLoading,
        pallet,
      }}
    >
      {children}
    </DelegationGuideContext.Provider>
  );
}

export function useDelegationGuideContext() {
  const context = useContext(DelegationGuideContext);
  return context || {};
}
