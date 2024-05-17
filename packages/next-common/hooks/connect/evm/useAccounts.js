import { CACHE_KEY } from "next-common/utils/constants";
import { normalizedMetaMaskAccounts } from "next-common/utils/metamask";
import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "react-use";
import { useAccount } from "wagmi";

/**
 * @param {Object} params
 * @param {import("wagmi").Connector} params.connector
 */
export function useAccounts({ connector } = {}) {
  const account = useAccount();
  const [lastEVMConnectedAddresses] = useLocalStorage(
    CACHE_KEY.lastEVMConnectedAddresses,
  );
  const [lastEVMConnectorID] = useLocalStorage(CACHE_KEY.lastEVMConnectorID);
  const [addresses, setAddresses] = useState(lastEVMConnectedAddresses);

  useEffect(() => {
    if (lastEVMConnectorID === connector?.id) {
      setAddresses(lastEVMConnectedAddresses);
    } else {
      setAddresses(account.addresses);
    }
  }, [connector]);

  const accounts = useMemo(
    () => normalizedMetaMaskAccounts(addresses || []),
    [addresses],
  );

  return accounts;
}
