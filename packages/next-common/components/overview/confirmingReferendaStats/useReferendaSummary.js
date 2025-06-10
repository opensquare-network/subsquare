import { gov2ReferendumsSummaryApi } from "next-common/services/url";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";

export default function useReferendaSummary() {
  return useAsync(async () => {
    return await backendApi.fetch(gov2ReferendumsSummaryApi).then((resp) => {
      if (resp.result) {
        return resp.result;
      }
    });
  }, []);
}
