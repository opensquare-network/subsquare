import { createContext, useContext } from "react";
import useDemotionExpirationCount from "../hooks/useDemotionExpirationCount";

export const DemotionExpirationCountContext = createContext();

export default function DemotionExpirationCountProvider({ children }) {
  const { expiredMembersCount, isLoading } = useDemotionExpirationCount();
  return (
    <DemotionExpirationCountContext.Provider
      value={{
        expiredMembersCount,
        isLoading,
      }}
    >
      {children}
    </DemotionExpirationCountContext.Provider>
  );
}

export function useContextDemotionExpirationCount() {
  return useContext(DemotionExpirationCountContext);
}
