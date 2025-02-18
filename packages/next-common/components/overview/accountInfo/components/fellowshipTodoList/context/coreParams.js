import { createContext, useContext } from "react";
import useCoreFellowshipParams from "next-common/hooks/fellowship/core/useCoreFellowshipParams";

export const CoreParamsContext = createContext({});

export default function CoreParamsProvider({ children }) {
  const { params, isLoading } = useCoreFellowshipParams();

  return (
    <CoreParamsContext.Provider value={{ params, isLoading }}>
      {children}
    </CoreParamsContext.Provider>
  );
}

export function useContextCoreParams() {
  return useContext(CoreParamsContext);
}
