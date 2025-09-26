import { createContext, useContext, useMemo } from "react";
import useCall from "next-common/utils/hooks/useCall";
import { useContextApi } from "../api";
import { useTreasuryPallet } from "./index";

export const TreasuryApprovalsContext = createContext(null);

export function TreasuryApprovalsProvider({ children }) {
  const api = useContextApi();
  const pallet = useTreasuryPallet();

  const approvalsQuery = useMemo(() => {
    return api?.query?.[pallet]?.approvals;
  }, [api, pallet]);

  const { value: rawApprovals } = useCall(approvalsQuery, []);
  const approvalsList = useMemo(() => {
    if (!rawApprovals) return [];
    return rawApprovals.toJSON() || [];
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
