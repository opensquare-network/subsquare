import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import { createContext, useContext } from "react";

const BalanceContext = createContext();

export default function BalanceProvider({ children }) {
  const signerAccount = useSignerAccount();

  const { value, loading } = useSubBalanceInfo(signerAccount?.realAddress);

  const { balance, transferrable } = value || {};
  return (
    <BalanceContext.Provider value={{ balance, transferrable, loading }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalanceContext() {
  return useContext(BalanceContext);
}
