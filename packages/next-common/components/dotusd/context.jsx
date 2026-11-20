import { createContext, useContext } from "react";
import usePsmData from "./usePsmData";

const DotUsdContext = createContext(null);

export default function DotUsdProvider({ children }) {
  const value = usePsmData();

  return (
    <DotUsdContext.Provider value={value}>{children}</DotUsdContext.Provider>
  );
}

export function useDotUsdContext() {
  return useContext(DotUsdContext);
}
