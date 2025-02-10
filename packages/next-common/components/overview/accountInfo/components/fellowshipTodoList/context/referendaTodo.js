import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import useReferendaTodo from "../hooks/useReferendaTodo";

export const ReferendaTodoContext = createContext();

export default function ReferendaTodoProvider({ children }) {
  const [trigger, setTrigger] = useState(0);
  const refresh = useCallback(() => setTrigger((prev) => prev + 1), []);

  const referendaTodoData = useReferendaTodo(trigger);

  const data = useMemo(
    () => ({ ...referendaTodoData, refresh }),
    [referendaTodoData, refresh],
  );

  return (
    <ReferendaTodoContext.Provider value={data}>
      {children}
    </ReferendaTodoContext.Provider>
  );
}

export function useReferendaTodoData() {
  return useContext(ReferendaTodoContext);
}
