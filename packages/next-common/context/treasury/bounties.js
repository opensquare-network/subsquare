import { createContext, useContext } from "react";

const CuratorContext = createContext();

export function CuratorProvider({ curator, children }) {
  return (
    <CuratorContext.Provider value={curator}>
      {children}
    </CuratorContext.Provider>
  );
}

export function useCurator() {
  return useContext(CuratorContext);
}
