import { createContext, useContext } from "react";

const CuratorContext = createContext();

export function CuratorProvider({ curator, params, children }) {
  return (
    <CuratorContext.Provider value={{ curator, params }}>
      {children}
    </CuratorContext.Provider>
  );
}

export function useCurator() {
  const { curator } = useContext(CuratorContext);
  return curator;
}

export function useCuratorParams() {
  const { params } = useContext(CuratorContext);
  return params;
}
