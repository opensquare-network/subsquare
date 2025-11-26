import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { useIsRelativesApiAvailable } from "next-common/hooks/useIsPureProxy";

export default function useMultisigAddress(address) {
  const isRelativesApiAvailable = useIsRelativesApiAvailable(address);

  const { value: result, loading } = useAsync(async () => {
    if (!isRelativesApiAvailable) {
      return false;
    }

    try {
      const { result } = await backendApi.fetch(
        `/multisig/addresses/${address}`,
      );

      return result ?? null;
    } catch (error) {
      return null;
    }
  }, [address, isRelativesApiAvailable]);

  return { result, loading };
}
