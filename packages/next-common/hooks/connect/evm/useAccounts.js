import { normalizedMetaMaskAccounts } from "next-common/utils/metamask";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export function useAccounts() {
  const { addresses, connector } = useAccount();

  const accounts = useMemo(() => {
    return normalizedMetaMaskAccounts(addresses, connector.id);
  }, [addresses]);

  return accounts;
}
