import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import { createContext, useContext } from "react";

export const MultisigBalanceContext = createContext();

export function MultisigBalanceProvider({ children, multisig }) {
  const { value: balance, loading } = useSubBalanceInfo(
    multisig.multisigAddress,
  );

  return (
    <MultisigBalanceContext.Provider value={{ balance, loading }}>
      {children}
    </MultisigBalanceContext.Provider>
  );
}

export function useMultisigBalance() {
  return useContext(MultisigBalanceContext) || {};
}
