import { createContext, useContext } from "react";
import useDapData from "./useDapData";

const DapContext = createContext(null);

export default function DapProvider({ children }) {
  const value = useDapData();

  return <DapContext.Provider value={value}>{children}</DapContext.Provider>;
}

export function useDapContext() {
  return useContext(DapContext);
}
