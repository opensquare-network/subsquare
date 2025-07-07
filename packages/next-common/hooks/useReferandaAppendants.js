import { gov2ReferendaAppendantApi } from "next-common/services/url";
import { backendApi } from "next-common/services/nextApi";
import { useCallback } from "react";

export default function useReferendaAppendants(referendumIndex) {
  const fetch = useCallback(async () => {
    const api = gov2ReferendaAppendantApi(referendumIndex);
    if (!api) {
      return;
    }

    const resp = await backendApi.fetch(api);
    return resp?.result;
  }, [referendumIndex]);

  return {
    fetch,
  };
} 
