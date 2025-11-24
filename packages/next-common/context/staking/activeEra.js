import { createContext, useContext, useMemo } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

const ActiveEraContext = createContext();

export function ActiveEraProvider({ children }) {
  const { result: optActiveEra, loading } = useSubStorage(
    "staking",
    "activeEra",
    [],
  );
  const activeEra = useMemo(() => optActiveEra?.toJSON(), [optActiveEra]);

  return (
    <ActiveEraContext.Provider value={{ activeEra, loading }}>
      {children}
    </ActiveEraContext.Provider>
  );
}

export function useCurrentEra() {
  const { activeEra, loading } = useContext(ActiveEraContext);
  return {
    currentEra: activeEra.index,
    loading,
  };
}
