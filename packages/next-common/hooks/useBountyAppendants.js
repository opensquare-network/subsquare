import { treasuryBountiesAppendantApi } from "next-common/services/url";
import { backendApi } from "next-common/services/nextApi";
import { useCallback } from "react";

export default function useBountyAppendants(bountyIndex) {
  const fetch = useCallback(async () => {
    const api = treasuryBountiesAppendantApi(bountyIndex);
    if (!api) {
      return;
    }

    const resp = await backendApi.fetch(api);
    return resp?.result;
  }, [bountyIndex]);

  return {
    fetch,
  };
}
