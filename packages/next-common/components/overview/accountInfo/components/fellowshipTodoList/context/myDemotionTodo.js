import { createContext, useContext } from "react";
import useMyDemotionTodo from "../hooks/useMyDemotionTodo";

export const MyDemotionTodoContext = createContext();

export default function MyDemotionTodoProvider({ children }) {
  const myDemotionTodoData = useMyDemotionTodo();
  return (
    <MyDemotionTodoContext.Provider value={myDemotionTodoData}>
      {children}
    </MyDemotionTodoContext.Provider>
  );
}

export function useMyDemotionTodoData() {
  return useContext(MyDemotionTodoContext);
}
