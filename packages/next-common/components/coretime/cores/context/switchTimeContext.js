import { createContext, useContext, useState, useCallback } from "react";
import { noop } from "lodash-es";

const DEFAULT_IS_TIME = false;

export const SwitchTimeContext = createContext({
  isTime: DEFAULT_IS_TIME,
  toggleIsTime: noop,
});

export function useSwitchTime() {
  return useContext(SwitchTimeContext);
}

export function SwitchTimeProvider({ children }) {
  const [isTime, setIsTime] = useState(DEFAULT_IS_TIME);
  const toggleIsTime = useCallback(() => {
    setIsTime((prev) => !prev);
  }, []);
  return (
    <SwitchTimeContext.Provider value={{ isTime, toggleIsTime }}>
      {children}
    </SwitchTimeContext.Provider>
  );
}
