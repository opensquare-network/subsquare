import { createContext, useContext } from "react";
import useDemotedBumpAllTodo from "../hooks/useDemotedBumpAllTodo";

export const DemotionTodoContext = createContext();

export default function DemotionTodoProvider({ children }) {
  const demotionTodoData = useDemotedBumpAllTodo();
  return (
    <DemotionTodoContext.Provider value={demotionTodoData}>
      {children}
    </DemotionTodoContext.Provider>
  );
}

export function useDemotionTodoData() {
  return useContext(DemotionTodoContext);
}
