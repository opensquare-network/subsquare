import { treasuryBountiesAppendantApi } from "next-common/services/url";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";

export default function useBountyAppendants(bountyIndex) {
  const { value, loading } = useAsync(async () => {
    const api = treasuryBountiesAppendantApi(bountyIndex);
    if (!api) {
      return;
    }

    const resp = await backendApi.fetch(api);
    return resp?.result;
  }, [bountyIndex]);

  return {
    value,
    loading,
  };
}
