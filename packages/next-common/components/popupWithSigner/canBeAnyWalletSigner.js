import { useMemo } from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import { useSignetAccounts, useSignetSdk } from "next-common/context/signet";
import { useEVMAccounts } from "next-common/hooks/connect/useEVMAccounts";
import { useSubstrateInjectedAccounts } from "next-common/hooks/connect/useSubstrateInjectedAccounts";

export default function CanBeAnyWalletSigner({ children }) {
  const { accounts: substrateInjectedAccounts, loading: isLoadingSubstrate } =
    useSubstrateInjectedAccounts();
  const { accounts: evmAccounts, loading: isLoadingEVM } = useEVMAccounts();
  const signetAccounts = useSignetAccounts();
  const { loading: isLoadingSignet } = useSignetSdk();

  const combinedAccounts = useMemo(
    () => [...evmAccounts, ...substrateInjectedAccounts, ...signetAccounts],
    [evmAccounts, substrateInjectedAccounts, signetAccounts],
  );

  if (isLoadingSubstrate || isLoadingSignet || isLoadingEVM) {
    return null;
  }

  return (
    <MaybeSignerConnected extensionAccounts={combinedAccounts}>
      {children}
    </MaybeSignerConnected>
  );
}
