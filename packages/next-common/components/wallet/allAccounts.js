import { createContext, useContext, useMemo } from "react";
import { useSubstrateInjectedAccounts } from "next-common/hooks/connect/useSubstrateInjectedAccounts";
import { useEVMAccounts } from "next-common/hooks/connect/useEVMAccounts";
import { useSignetAccounts, useSignetSdk } from "next-common/context/signet";
import { useUser } from "next-common/context/user";

const AllAccountsContext = createContext();

function getSortedAccounts(accounts, userAddress) {
  if (!accounts || !userAddress) return accounts || [];

  return [...accounts].sort((a, b) => {
    if (a.address === userAddress) return -1;
    if (b.address === userAddress) return 1;
    return 0;
  });
}

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
  const { accounts, isLoading } = useContext(AllAccountsContext);
  const user = useUser();

  const sortedAccounts = useMemo(
    () => getSortedAccounts(accounts, user?.address),
    [accounts, user?.address],
  );

  return { accounts: sortedAccounts, isLoading };
}
