import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useSubstrateInjectedAccounts } from "next-common/hooks/connect/useSubstrateInjectedAccounts";
import { useEVMAccounts } from "next-common/hooks/connect/useEVMAccounts";
import { useSignetAccounts, useSignetSdk } from "next-common/context/signet";

const AllAccountsContext = createContext();

export function AllAccountsProvider({ children }) {
  const { accounts: substrateInjectedAccounts, loading: isLoadingSubstrate } =
    useSubstrateInjectedAccounts();
  const { accounts: evmAccounts, loading: isLoadingEVM } = useEVMAccounts();
  const signetAccounts = useSignetAccounts();
  const { loading: isLoadingSignet } = useSignetSdk();

  const combinedAccounts = useMemo(
    () => [...evmAccounts, ...substrateInjectedAccounts, ...signetAccounts],
    [evmAccounts, substrateInjectedAccounts, signetAccounts],
  );

  const [activeAccount, setActiveAccount] = useState(null);

  const isLoading = isLoadingSubstrate || isLoadingSignet || isLoadingEVM;

  useEffect(() => {
    if (!isLoading && combinedAccounts.length > 0 && !activeAccount) {
      setActiveAccount(combinedAccounts[0]);
    }
  }, [isLoading, combinedAccounts, activeAccount]);

  const contextValue = useMemo(
    () => ({
      accounts: combinedAccounts,
      activeAccount,
      isLoading,
    }),
    [combinedAccounts, activeAccount, isLoading],
  );

  return (
    <AllAccountsContext.Provider value={contextValue}>
      {!isLoading && children}
    </AllAccountsContext.Provider>
  );
}

export function useAllAccounts() {
  const context = useContext(AllAccountsContext);
  return context;
}
