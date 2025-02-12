import { createContext, useContext } from "react";
import useDemotionExpirationTodo from "../hooks/useDemotionExpirationTodo";

export const DemotionExpirationTodoContext = createContext();

export default function DemotionExpirationTodoProvider({ children }) {
  const demotionExpirationTodoData = useDemotionExpirationTodo();
  return (
    <DemotionExpirationTodoContext.Provider value={demotionExpirationTodoData}>
      {children}
    </DemotionExpirationTodoContext.Provider>
  );
}

export function useDemotionExpirationTodoData() {
  return useContext(DemotionExpirationTodoContext);
}
