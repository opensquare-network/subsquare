import { normalizedMetaMaskAccounts } from "next-common/utils/metamask";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export function useAccounts() {
  const { addresses, connector, isConnected } = useAccount();

  const accounts = useMemo(() => {
    if (isConnected && connector) {
      return normalizedMetaMaskAccounts(addresses, connector.id);
    }

    return [];
  }, [addresses, connector, isConnected]);

  return accounts;
}
