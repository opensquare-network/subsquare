import { createContext, useContext, useState, useCallback } from "react";
import { noop } from "lodash-es";

const DEFAULT_IS_TIME = false;

export const ExecutionTimeContext = createContext({
  isTime: DEFAULT_IS_TIME,
  toggleIsTime: noop,
});

export function useExecutionTimeContext() {
  return useContext(ExecutionTimeContext);
}

export function ExecutionTimeProvider({ children }) {
  const [isTime, setIsTime] = useState(DEFAULT_IS_TIME);
  const toggleIsTime = useCallback(() => {
    setIsTime((prev) => !prev);
  }, []);
  return (
    <ExecutionTimeContext.Provider value={{ isTime, toggleIsTime }}>
      {children}
    </ExecutionTimeContext.Provider>
  );
}
