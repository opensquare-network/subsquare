import { createContext, useContext } from "react";
import useDemotionExpirationCount from "../hooks/useDemotionExpirationCount";

export const DemotionExpirationTodoContext = createContext();

export default function DemotionExpirationTodoProvider({ children }) {
  const { expiredMembersCount, isLoading } = useDemotionExpirationCount();
  return (
    <DemotionExpirationTodoContext.Provider
      value={{
        expiredMembersCount,
        isLoading,
      }}
    >
      {children}
    </DemotionExpirationTodoContext.Provider>
  );
}

export function useDemotionExpirationTodoData() {
  return useContext(DemotionExpirationTodoContext);
}
