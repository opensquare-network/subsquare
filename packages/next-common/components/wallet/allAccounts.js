import { createContext, useContext, useMemo } from "react";
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

  const isLoading = isLoadingSubstrate || isLoadingSignet || isLoadingEVM;

  const contextValue = useMemo(
    () => ({
      accounts: combinedAccounts,
      isLoading,
    }),
    [combinedAccounts, isLoading],
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
