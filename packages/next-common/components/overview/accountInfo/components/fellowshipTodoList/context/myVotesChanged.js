import { createContext, useCallback, useContext, useState } from "react";

export const MyVotesChangedContext = createContext({});

export default function MyVotesChangedProvider({ children }) {
  const [myVotesChangeTimes, setMyVotesChangeTimes] = useState(0);

  const triggerMyVotesChanged = useCallback(() => {
    setMyVotesChangeTimes((prev) => prev + 1);
  }, [setMyVotesChangeTimes]);

  return (
    <MyVotesChangedContext.Provider
      value={{ myVotesChangeTimes, triggerMyVotesChanged }}
    >
      {children}
    </MyVotesChangedContext.Provider>
  );
}

export function useMyVotesChangedContext() {
  return useContext(MyVotesChangedContext);
}
