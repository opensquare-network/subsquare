import { normalizeEVMAccount } from "next-common/utils/metamask";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export function useAccounts() {
  const { addresses, connector } = useAccount();

  const accounts = useMemo(() => {
    return addresses.map?.((address) => {
      return normalizeEVMAccount(address, connector.name?.toLowerCase());
    });
  }, [addresses, connector]);

  return accounts;
}
