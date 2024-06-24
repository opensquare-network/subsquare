import { useMemo } from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import { useSignetAccounts, useSignetSdk } from "next-common/context/signet";
import { useEVMAccounts } from "next-common/hooks/connect/useEVMAccounts";
import { useSubstrateAccounts } from "next-common/hooks/connect/useSubstrateAccounts";

export default function CanBeAnyWalletSigner({ children }) {
  const { accounts: substrateAccounts, loading: isLoadingSubstrate } =
    useSubstrateAccounts();
  const { accounts: evmAccounts, loading: isLoadingEVM } = useEVMAccounts();
  const signetAccounts = useSignetAccounts();
  const { loading: isLoadingSignet } = useSignetSdk();

  const combinedAccounts = useMemo(
    () => [...evmAccounts, ...substrateAccounts, ...signetAccounts],
    [evmAccounts, substrateAccounts, signetAccounts],
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
