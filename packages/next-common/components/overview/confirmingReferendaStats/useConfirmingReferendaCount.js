import { gov2ReferendumsSummaryApi } from "next-common/services/url";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { useState } from "react";

export default function useConfirmingReferendaCount() {
  const [loading, setLoading] = useState(true);

  const { value: summaryData } = useAsync(async () => {
    setLoading(true);

    try {
      const resp = await backendApi.fetch(gov2ReferendumsSummaryApi);

      return resp?.result || {};
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    value: summaryData?.confirmingCount || 0,
    loading,
  };
}
