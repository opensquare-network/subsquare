import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { isAddress } from "@polkadot/util-crypto";

export default function useIsPureProxy(address) {
  const { value: isPure, loading } = useAsync(async () => {
    if (address === "" || !isAddress(address)) {
      return false;
    }

    try {
      const { result } = await backendApi.fetch(`/proxies/pure/${address}`);

      return !!result;
    } catch {
      return false;
    }
  }, [address]);

  return { isPure, loading };
}
