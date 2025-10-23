import { fetchMultisigAddresses } from "next-common/services/multisig";
import { useAsync } from "react-use";

export default function useExplorerMultisigHistory(chain, address, page = 1) {
  const { value: data, loading } = useAsync(async () => {
    const { result } = await fetchMultisigAddresses(chain, address, page);
    return result?.data?.multisigAddresses;
  }, [chain, address, page]);

  return {
    loading,
    total: data?.total || 0,
    items: data?.multisigAddresses || [],
  };
}
