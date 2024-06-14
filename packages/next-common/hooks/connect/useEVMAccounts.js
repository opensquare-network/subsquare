import { normalizedMetaMaskAccounts } from "next-common/utils/metamask";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export function useEVMAccounts() {
  const { addresses, connector, isConnected, isConnecting, isReconnecting } =
    useAccount();
  const loading = isConnecting || isReconnecting;

  const accounts = useMemo(() => {
    if (isConnected && connector) {
      return normalizedMetaMaskAccounts(addresses, connector.id);
    }

    return [];
  }, [addresses, connector, isConnected]);

  return { accounts, loading };
}
