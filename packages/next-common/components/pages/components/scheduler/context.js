import { createContext, useContext, useState, useCallback } from "react";

export const ExecutionTimeContext = createContext({
  isTime: true,
  toggleIsTime: () => {},
});

export function useExecutionTimeContext() {
  return useContext(ExecutionTimeContext);
}

export function ExecutionTimeProvider({ children }) {
  const [isTime, setIsTime] = useState(true);
  const toggleIsTime = useCallback(() => {
    setIsTime((prev) => !prev);
  }, []);
  return (
    <ExecutionTimeContext.Provider value={{ isTime, toggleIsTime }}>
      {children}
    </ExecutionTimeContext.Provider>
  );
}
