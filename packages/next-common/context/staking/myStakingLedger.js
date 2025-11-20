import { useStakingLedgers } from "next-common/hooks/useStakingLedgers";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { createContext, useContext } from "react";

export const MyStakingLedgerContext = createContext(null);

export function MyStakingLedgerProvider({ children }) {
  const realAddress = useRealAddress();
  const { ledger, payee, nominators, loading } = useStakingLedgers(realAddress);
  return (
    <MyStakingLedgerContext.Provider
      value={{ ledger, payee, nominators, loading }}
    >
      {children}
    </MyStakingLedgerContext.Provider>
  );
}

export function useMyStakingLedger() {
  return useContext(MyStakingLedgerContext) || {};
}
