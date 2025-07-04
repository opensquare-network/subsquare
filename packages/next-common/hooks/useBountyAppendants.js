import { treasuryBountiesAppendantApi } from "next-common/services/url";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import { useCallback } from "react";

export default function useBountyAppendants(bountyIndex) {
  const fetchAppendants = useCallback(async () => {
    const api = treasuryBountiesAppendantApi(bountyIndex);
    if (!api) {
      return;
    }

    const resp = await backendApi.fetch(api);
    return resp?.result;
  }, [bountyIndex]);

  const { value, loading } = useAsync(fetchAppendants, [bountyIndex]);

  return {
    fetch: fetchAppendants,
    value,
    loading,
  };
}
