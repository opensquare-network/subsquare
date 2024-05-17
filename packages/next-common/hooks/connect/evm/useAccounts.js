import { normalizedMetaMaskAccounts } from "next-common/utils/metamask";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export function useAccounts() {
  const { addresses: evmAddresses = [] } = useAccount();

  const addresses = useMemo(
    () => normalizedMetaMaskAccounts(evmAddresses || []),
    [evmAddresses],
  );

  return addresses;
}
