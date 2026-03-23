import { createContext, useContext, useMemo } from "react";
import useCall from "next-common/utils/hooks/useCall";
import { useTreasuryPapiPallet } from "./index";
import { useContextPapiApi } from "../papi";

export const TreasuryApprovalsContext = createContext(null);

export function TreasuryApprovalsProvider({ children }) {
  const papi = useContextPapiApi();
  const papiPallet = useTreasuryPapiPallet();

  const approvalsQuery = useMemo(() => {
    return papi?.query?.[papiPallet]?.Approvals?.getValue;
  }, [papi, papiPallet]);

  const { value: rawApprovals } = useCall(approvalsQuery, []);
  const approvalsList = useMemo(() => {
    if (!rawApprovals) return [];
    return rawApprovals || [];
  }, [rawApprovals]);

  return (
    <TreasuryApprovalsContext.Provider value={{ approvalsList }}>
      {children}
    </TreasuryApprovalsContext.Provider>
  );
}

export function useTreasuryApprovals() {
  return useContext(TreasuryApprovalsContext) || {};
}
