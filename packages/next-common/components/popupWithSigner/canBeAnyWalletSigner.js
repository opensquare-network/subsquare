import { useMemo } from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import { useEVMAccounts } from "next-common/hooks/connect/useEVMAccounts";
import { useSubstrateInjectedAccounts } from "next-common/hooks/connect/useSubstrateInjectedAccounts";
import { usePopupParams } from "./context";

export default function CanBeAnyWalletSigner({ children }) {
  const { loadingContent = null } = usePopupParams();
  const { accounts: substrateInjectedAccounts, loading: isLoadingSubstrate } =
    useSubstrateInjectedAccounts();
  const { accounts: evmAccounts, loading: isLoadingEVM } = useEVMAccounts();

  const combinedAccounts = useMemo(
    () => [...evmAccounts, ...substrateInjectedAccounts],
    [evmAccounts, substrateInjectedAccounts],
  );

  if (isLoadingSubstrate || isLoadingEVM) {
    return loadingContent;
  }

  return (
    <MaybeSignerConnected extensionAccounts={combinedAccounts}>
      {children}
    </MaybeSignerConnected>
  );
}
